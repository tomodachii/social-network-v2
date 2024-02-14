import { Inject } from '@nestjs/common';
import { RELATIONSHIP_REPOSITORY } from '../relationship.di-token';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnfollowCommand } from './unfollow.command';
import {
  RelationshipEntity,
  RelationshipRepository,
  RelationshipType,
} from '@lib/relationship/domain';
import { CreatedAt, UUID, UpdatedAt } from '@lib/shared/ddd';
import { RequestContextService } from '@lib/shared/common/application';

@CommandHandler(UnfollowCommand)
export class UnfollowCommandHandler
  implements ICommandHandler<UnfollowCommand>
{
  constructor(
    @Inject(RELATIONSHIP_REPOSITORY)
    protected readonly repo: RelationshipRepository
  ) {}

  async execute(command: UnfollowCommand): Promise<boolean> {
    const relationship = new RelationshipEntity({
      id: UUID.generate(),
      props: {
        sourceUserId: new UUID({ value: RequestContextService.getUserId() }),
        targetUserId: new UUID({ value: command.followeeId }),
        relationshipType: RelationshipType.NONE,
      },
      createdAt: new CreatedAt({ value: new Date() }),
      updatedAt: new UpdatedAt({ value: new Date() }),
    });

    return await this.repo.remove(relationship, RelationshipType.FOLLOW);
  }
}
