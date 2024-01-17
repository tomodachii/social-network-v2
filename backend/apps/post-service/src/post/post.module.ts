import { Module, Provider, Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DataAccessPostModule } from '@lib/post/data-access';
import {
  KafkaConfig,
  KafkaPostProducer,
  MongoPostMapper,
  MongoPostRepository,
  MongoUserReplicaRepository,
  // MysqlPostMapper,
  // MysqlPostRepository,
} from './infrastructure-adapter';
import {
  CreatePostCommandHandler,
  DeletePostCommandHandler,
  UpdatePostCommandHandler,
  CreateCommentCommandHandler,
  ViewPostQueryHandler,
  POST_REPOSITORY,
  UpdateCommentCommandHandler,
  DeleteCommentCommandHandler,
  ReactPostCommandHandler,
  ReactCommentCommandHandler,
  CreatePostWhenUserUpdatedBioImageDomainEventHandler,
  POST_PRODUCER,
} from '@lib/post/feature';
import {
  HttpCommentController,
  HttpPostController,
  HttpReactController,
  KafkaUserConsumer,
} from './interface-adapter';
import {
  SaveUserReplicaCommandHandler,
  UpdateAvatarUserReplicaCommandHandler,
  UpdateCoverUserReplicaCommandHandler,
  USER_REPLICA_REPOSITORY,
} from '@lib/post/replica-user';
import { ClientsModule } from '@nestjs/microservices';

const httpControllers = [
  HttpPostController,
  HttpCommentController,
  HttpReactController,
];

const consumers = [KafkaUserConsumer];

const producers: Provider[] = [KafkaPostProducer];

const commandHandlers: Provider[] = [
  CreatePostCommandHandler,
  UpdatePostCommandHandler,
  DeletePostCommandHandler,
  CreateCommentCommandHandler,
  UpdateCommentCommandHandler,
  DeleteCommentCommandHandler,
  ReactPostCommandHandler,
  ReactCommentCommandHandler,
  SaveUserReplicaCommandHandler,
  UpdateAvatarUserReplicaCommandHandler,
  UpdateCoverUserReplicaCommandHandler,
];

const queryHandlers: Provider[] = [ViewPostQueryHandler];

const eventHandlers: Provider[] = [
  CreatePostWhenUserUpdatedBioImageDomainEventHandler,
];

const mappers: Provider[] = [MongoPostMapper];

const infra: Provider[] = [
  {
    provide: POST_REPOSITORY,
    useClass: MongoPostRepository,
  },
  {
    provide: POST_PRODUCER,
    useClass: KafkaPostProducer,
  },
  {
    provide: USER_REPLICA_REPOSITORY,
    useClass: MongoUserReplicaRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    DataAccessPostModule,
    ClientsModule.register([KafkaConfig]),
  ],
  controllers: [...httpControllers, ...consumers],
  providers: [
    Logger,
    ...infra,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...mappers,
    ...producers,
  ],
})
export class PostModule {}
