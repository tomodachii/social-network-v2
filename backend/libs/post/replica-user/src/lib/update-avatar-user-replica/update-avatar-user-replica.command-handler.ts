import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAvatarUserReplicaCommand } from './update-avatar-user-replica.command';
import { Option, Some } from 'oxide.ts';
import { UserReplicaRepository } from '../domain';
import { Inject } from '@nestjs/common';
import { USER_REPLICA_REPOSIROTY } from '../user-replica.di-token';
import { UserBioImageUpdateDomainEvent } from '../events';

@CommandHandler(UpdateAvatarUserReplicaCommand)
export class UpdateAvatarUserReplicaCommandHandler
  implements ICommandHandler<UpdateAvatarUserReplicaCommand>
{
  constructor(
    @Inject(USER_REPLICA_REPOSIROTY)
    private readonly repo: UserReplicaRepository,
    private readonly eventBus: EventBus
  ) {}
  async execute(
    command: UpdateAvatarUserReplicaCommand
  ): Promise<Option<boolean>> {
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

    await this.repo.updateAvatar({
      userId: command.userId,
      avatarFileId: command.avatarFileId,
      version: command.version + 1,
    });

    this.eventBus.publish(
      new UserBioImageUpdateDomainEvent({
        fileId: command.avatarFileId,
        size: command.size,
        aggregateId: command.userId,
        extension: command.extension,
        metadata: {
          correlationId: command.metadata.correlationId,
          timestamp: command.metadata.timestamp,
        },
      })
    );

    return Some(true);
  }
}
