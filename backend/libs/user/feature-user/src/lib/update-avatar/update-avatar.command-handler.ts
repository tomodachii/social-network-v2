import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAvatarCommand } from './update-avatar.command';
import { USER_PRODUCER, USER_REPOSITORY } from '../user.di-token';
import { Inject } from '@nestjs/common';
import {
  UserNotFoundError,
  UserProducer,
  UserRepository,
} from '@lib/user/domain';
import { AvatarUpdatedEvent } from '@lib/shared/service-interface';
import { RequestContextService } from '@lib/shared/common/application';

@CommandHandler(UpdateAvatarCommand)
export class UpdateAvatarCommandHandler implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    @Inject(USER_PRODUCER)
    private readonly userProducer: UserProducer
  ) {}

  async execute(command: UpdateAvatarCommand): Promise<boolean> {
    const userResult = await this.userRepo.findById(
      RequestContextService.getUserId()
    );

    if (userResult.isNone()) {
      throw new UserNotFoundError();
    }
    const user = userResult.unwrap();

    user.updateAvatar({
      id: command.fileId,
      extension: command.extension,
      size: command.size,
    });

    const result = await this.userRepo.updateAvatar(user);

    const avatar = user.avatar!;
    const updatedAvatarEvent: AvatarUpdatedEvent = {
      userId: user.id,
      avatarFileId: avatar.id,
      size: avatar.getPropsCopy().size,
      version: 0,
    };
    this.userProducer.publishAvatarUpdatedEvent(updatedAvatarEvent);
    return result;
  }
}
