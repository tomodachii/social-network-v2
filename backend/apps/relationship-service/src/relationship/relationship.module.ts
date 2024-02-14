import { DataAccessRelationshipModule } from '@lib/relationship/data-access';
import { Logger, Module, Provider } from '@nestjs/common';
import { RelationshipController } from './interface-adapter';
import { CqrsModule } from '@nestjs/cqrs';
import {
  AddFriendCommandHandler,
  BlockCommandHandler,
  FollowCommandHandler,
  RELATIONSHIP_REPOSITORY,
  UnblockCommandHandler,
  UnfollowCommandHandler,
  UnfriendCommandHandler,
} from '@lib/relationship/feature';
import { Neo4jRelationshipRepository } from './infrastructure-adapter';

const httpControllers = [RelationshipController];

const consumers = [];

const commandHandlers: Provider[] = [
  UnfriendCommandHandler,
  AddFriendCommandHandler,
  FollowCommandHandler,
  UnfollowCommandHandler,
  BlockCommandHandler,
  UnblockCommandHandler,
];

const queryHandlers: Provider[] = [];

const mappers: Provider[] = [];

const infra: Provider[] = [
  {
    provide: RELATIONSHIP_REPOSITORY,
    useClass: Neo4jRelationshipRepository,
  },
];

@Module({
  imports: [CqrsModule, DataAccessRelationshipModule],
  controllers: [...httpControllers, ...consumers],
  providers: [
    Logger,
    ...infra,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class RelationshipModule {}
