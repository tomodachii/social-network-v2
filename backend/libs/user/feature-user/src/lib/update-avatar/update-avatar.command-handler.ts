import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAvatarCommand } from './update-avatar.command';
import { USER_REPOSITORY } from '../user.di-token';
import { Inject } from '@nestjs/common';
import { UserNotFoundError, UserRepository } from '@lib/user/domain';

@CommandHandler(UpdateAvatarCommand)
export class UpdateAvatarCommandHandler implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepository
  ) {}

  async execute(command: UpdateAvatarCommand): Promise<boolean> {
    const userResult = await this.userRepo.findById(command.userId);

    if (userResult.isNone()) {
      throw new UserNotFoundError();
    }
    const user = userResult.unwrap();

    user.updateAvatar({
      id: command.fileId,
      extension: command.extension,
      size: command.size,
    });

    return await this.userRepo.updateAvatar(user);
  }
}
