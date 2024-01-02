import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import {
  AUTH_SERVICE_PROXY,
  USER_PRODUCER,
  USER_REPOSITORY,
} from '../user.di-token';
import { Inject } from '@nestjs/common';
import { UserEntity, UserProducer, UserRepository } from '@lib/user/domain';
import { AuthServiceProxyPort } from '@lib/auth-service-proxy';
import { Ok, Result } from 'oxide.ts';
import { Exception } from '@lib/shared/common/exceptions';
import { CreateUserResponse } from './create-user-response.interface';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    @Inject(AUTH_SERVICE_PROXY)
    private readonly authServiceProxy: AuthServiceProxyPort,
    @Inject(USER_PRODUCER)
    private readonly userProducer: UserProducer
  ) {}

  async execute(
    command: CreateUserCommand
  ): Promise<Result<CreateUserResponse, Error>> {
    const user = UserEntity.create({
      firstName: command.firstName,
      lastName: command.lastName,
      gender: command.gender,
      birthDay: command.birthDay,
    });

    const credential = await this.createCredential(user, command);

    try {
      await this.userRepo.insertOne(user);

      this.publishEvent(user);

      return Ok({
        token: credential.data.token,
        refreshToken: credential.data.refreshToken,
        expired: credential.data.expired,
        userId: user.id,
      });
    } catch (error: unknown) {
      // Todos rollback
      await this.authServiceProxy.rollbackSaveCredential(user.id);
      throw error;
    }
  }

  private async createCredential(user: UserEntity, command: CreateUserCommand) {
    const credential = await this.authServiceProxy.createCredentials({
      userId: user.id,
      fullName: user.fullName,
      email: command.email,
      password: command.password,
      phoneNumber: command.phoneNumber,
    });

    if (!credential.meta.isSuccess) {
      throw new Exception(
        credential.meta.message.toString(),
        credential.meta.status
      );
    }
    return credential;
  }

  private publishEvent(user: UserEntity) {
    this.userProducer.publishUserCreatedEvent(user);
  }
}
