import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlockCommand } from './block.command';
import { RELATIONSHIP_REPOSITORY } from '../relationship.di-token';
import { Inject } from '@nestjs/common';
import {
  RelationshipEntity,
  RelationshipRepository,
  RelationshipType,
} from '@lib/relationship/domain';
import { CreatedAt, UUID, UpdatedAt } from '@lib/shared/ddd';
import { RequestContextService } from '@lib/shared/common/application';

@CommandHandler(BlockCommand)
export class BlockCommandHandler implements ICommandHandler<BlockCommand> {
  constructor(
    @Inject(RELATIONSHIP_REPOSITORY)
    protected readonly repo: RelationshipRepository
  ) {}

  async execute(command: BlockCommand): Promise<boolean> {
    const relationship = new RelationshipEntity({
      id: UUID.generate(),
      props: {
        sourceUserId: new UUID({ value: RequestContextService.getUserId() }),
        targetUserId: new UUID({ value: command.userBlockId }),
        relationshipType: RelationshipType.BLOCK,
      },
      createdAt: new CreatedAt({ value: new Date() }),
      updatedAt: new UpdatedAt({ value: new Date() }),
    });

    return await this.repo.save(relationship);
  }
}
