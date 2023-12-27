import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCoverCommand } from './update-cover.command';
import { USER_REPOSITORY } from '../user.di-token';
import { UserNotFoundError, UserRepository } from '@lib/user/domain';

@CommandHandler(UpdateCoverCommand)
export class UpdateCoverCommandHandler implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepository
  ) {}

  async execute(command: UpdateCoverCommand): Promise<boolean> {
    const userResult = await this.userRepo.findById(command.userId);

    if (userResult.isNone()) {
      throw new UserNotFoundError();
    }

    const user = userResult.unwrap();

    user.updateCover({
      id: command.fileId,
      extension: command.extension,
      size: command.size,
    });

    return await this.userRepo.updateCover(user);
  }
}
