import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnfriendCommand } from './unfriend.command';
import {
  RelationshipEntity,
  RelationshipRepository,
  RelationshipType,
} from '@lib/relationship/domain';
import { CreatedAt, UUID, UpdatedAt } from '@lib/shared/ddd';
import { RequestContextService } from '@lib/shared/common/application';
import { Inject } from '@nestjs/common';
import { RELATIONSHIP_REPOSITORY } from '../relationship.di-token';

@CommandHandler(UnfriendCommand)
export class UnfriendCommandHandler
  implements ICommandHandler<UnfriendCommand>
{
  constructor(
    @Inject(RELATIONSHIP_REPOSITORY)
    protected readonly repo: RelationshipRepository
  ) {}
  async execute(command: UnfriendCommand) {
    const relationship = new RelationshipEntity({
      id: UUID.generate(),
      props: {
        sourceUserId: new UUID({ value: RequestContextService.getUserId() }),
        targetUserId: new UUID({ value: command.friendId }),
        relationshipType: RelationshipType.NONE,
      },
      createdAt: new CreatedAt({ value: new Date() }),
      updatedAt: new UpdatedAt({ value: new Date() }),
    });
    await this.repo.save(relationship);
  }
}
