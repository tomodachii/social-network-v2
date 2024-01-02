import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveUserReplicaCommand } from './save-user-replica.command';
import { Option, Some } from 'oxide.ts';
import { UserReplicaRepository } from '../domain';
import { Inject } from '@nestjs/common';
import { USER_REPLICA_REPOSIROTY } from '../user-replica.di-token';

@CommandHandler(SaveUserReplicaCommand)
export class SaveUserReplicaCommandHandler
  implements ICommandHandler<SaveUserReplicaCommand>
{
  constructor(
    @Inject(USER_REPLICA_REPOSIROTY)
    private readonly repo: UserReplicaRepository
  ) {}

  async execute(command: SaveUserReplicaCommand): Promise<Option<boolean>> {
    // const user = await this.prisma.userRecord.findUnique({
    //   where: {
    //     userId: command.userId,
    //   },
    // });

    // if (user && user.version !== command.version + 1) {
    //   return Err(
    //     new Exception('Version mismatch', HttpStatus.UNPROCESSABLE_ENTITY)
    //   );
    // }

    await this.repo.saveReplica({
      userId: command.userId,
      firstName: command.firstName,
      lastName: command.lastName,
      avatarFileId: null,
      version: command.version + 1,
    });

    return Some(true);
  }
}
