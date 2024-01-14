import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCoverUserReplicaCommand } from './update-cover-user-replica.command';
import { Option, Some } from 'oxide.ts';
import { UserReplicaRepository } from '../domain';
import { Inject } from '@nestjs/common';
import { USER_REPLICA_REPOSITORY } from '../user-replica.di-token';
import { UserBioImageUpdateDomainEvent } from '../events';

@CommandHandler(UpdateCoverUserReplicaCommand)
export class UpdateCoverUserReplicaCommandHandler
  implements ICommandHandler<UpdateCoverUserReplicaCommand>
{
  constructor(
    @Inject(USER_REPLICA_REPOSITORY)
    private readonly repo: UserReplicaRepository,
    private readonly eventBus: EventBus
  ) {}
  async execute(
    command: UpdateCoverUserReplicaCommand
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

    await this.repo.updateVersion(command.userId);

    this.eventBus.publish(
      new UserBioImageUpdateDomainEvent({
        fileId: command.coverFileId,
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
