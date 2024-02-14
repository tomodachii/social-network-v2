import {
  RelationshipEntity,
  RelationshipRepository,
  RelationshipType,
} from '@lib/relationship/domain';
import { FollowCommand } from './follow.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatedAt, UUID, UpdatedAt } from '@lib/shared/ddd';
import { RequestContextService } from '@lib/shared/common/application';
import { Inject } from '@nestjs/common';
import { RELATIONSHIP_REPOSITORY } from '../relationship.di-token';

@CommandHandler(FollowCommand)
export class FollowCommandHandler implements ICommandHandler<FollowCommand> {
  constructor(
    @Inject(RELATIONSHIP_REPOSITORY)
    protected readonly repo: RelationshipRepository
  ) {}
  async execute(command: FollowCommand): Promise<boolean> {
    const relationship = new RelationshipEntity({
      id: UUID.generate(),
      props: {
        sourceUserId: new UUID({ value: RequestContextService.getUserId() }),
        targetUserId: new UUID({ value: command.followeeId }),
        relationshipType: RelationshipType.FOLLOW,
      },
      createdAt: new CreatedAt({ value: new Date() }),
      updatedAt: new UpdatedAt({ value: new Date() }),
    });

    return await this.repo.save(relationship);
  }
}
