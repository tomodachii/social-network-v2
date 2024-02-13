import {
  RelationshipEntity,
  RelationshipRepository,
  RelationshipType,
} from '@lib/relationship/domain';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddFriendCommand } from './add-friend.command';
import { RequestContextService } from '@lib/shared/common/application';
import { CreatedAt, UUID, UpdatedAt } from '@lib/shared/ddd';
import { Inject } from '@nestjs/common';
import { RELATIONSHIP_REPOSITORY } from '../relationship.di-token';

@CommandHandler(AddFriendCommand)
export class AddFriendCommandHandler
  implements ICommandHandler<AddFriendCommand>
{
  constructor(
    @Inject(RELATIONSHIP_REPOSITORY)
    protected readonly repo: RelationshipRepository
  ) {}

  async execute(command: AddFriendCommand): Promise<boolean> {
    const relationship = new RelationshipEntity({
      id: UUID.generate(),
      props: {
        sourceUserId: new UUID({ value: RequestContextService.getUserId() }),
        targetUserId: new UUID({ value: command.friendId }),
        relationshipType: RelationshipType.FRIEND,
      },
      createdAt: new CreatedAt({ value: new Date() }),
      updatedAt: new UpdatedAt({ value: new Date() }),
    });
    return await this.repo.save(relationship);
  }
}
