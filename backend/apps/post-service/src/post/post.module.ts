import { Module, Provider, Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DataAccessPostModule } from '@lib/post/data-access';
import {
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
} from '@lib/post/feature';
import {
  HttpCommentController,
  HttpPostController,
  HttpReactController,
  KafkaUserConsumer,
} from './interface-adapter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from '@lib/shared/common/application';
import { RequestContextModule } from 'nestjs-request-context';
import {
  SaveUserReplicaCommandHandler,
  UpdateAvatarUserReplicaCommandHandler,
  UpdateCoverUserReplicaCommandHandler,
  USER_REPLICA_REPOSIROTY,
} from '@lib/post/replica-user';

const httpControllers = [
  HttpPostController,
  HttpCommentController,
  HttpReactController,
];

const consummers = [KafkaUserConsumer];

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

const repositories: Provider[] = [
  {
    provide: POST_REPOSITORY,
    useClass: MongoPostRepository,
  },
  {
    provide: USER_REPLICA_REPOSIROTY,
    useClass: MongoUserReplicaRepository,
  },
];

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  // {
  //   provide: APP_INTERCEPTOR,
  //   useClass: ExceptionInterceptor,
  // },
];
@Module({
  imports: [CqrsModule, DataAccessPostModule, RequestContextModule],
  controllers: [...httpControllers, ...consummers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...mappers,
    ...interceptors,
  ],
})
export class PostModule {}
