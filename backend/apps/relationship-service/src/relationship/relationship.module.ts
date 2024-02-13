import {
  DataAccessRelationshipModule,
  MockRelationshipRepository,
} from '@lib/relationship/data-access';
import { Logger, Module, Provider } from '@nestjs/common';
import { RelationshipController } from './interface-adapter';
import { CqrsModule } from '@nestjs/cqrs';
import {
  AddFriendCommandHandler,
  BlockCommandHandler,
  FollowCommandHandler,
  RELATIONSHIP_REPOSITORY,
  UnfollowCommandHandler,
  UnfriendCommandHandler,
} from '@lib/relationship/feature';

const httpControllers = [RelationshipController];

const consumers = [];

const commandHandlers: Provider[] = [
  UnfriendCommandHandler,
  AddFriendCommandHandler,
  FollowCommandHandler,
  UnfollowCommandHandler,
  BlockCommandHandler,
];

const queryHandlers: Provider[] = [];

const mappers: Provider[] = [];

const infra: Provider[] = [
  {
    provide: RELATIONSHIP_REPOSITORY,
    useClass: MockRelationshipRepository,
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
