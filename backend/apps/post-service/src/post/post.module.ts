import { Module, Provider, Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DataAccessPostModule } from '@lib/post/data-access';
import {
  MysqlPostRepository,
  MongoPostMapper,
  MongoPostRepository,
  MysqlPostMapper,
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
} from '@lib/post/feature';
import {
  HttpCommentController,
  HttpPostController,
  HttpReactController,
} from './interface-adapter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from '@lib/shared/common/application';
import { RequestContextModule } from 'nestjs-request-context';

const httpControllers = [
  HttpPostController,
  HttpCommentController,
  HttpReactController,
];

// const messageControllers = [UserMessageController];

const commandHandlers: Provider[] = [
  CreatePostCommandHandler,
  UpdatePostCommandHandler,
  DeletePostCommandHandler,
  CreateCommentCommandHandler,
  UpdateCommentCommandHandler,
  DeleteCommentCommandHandler,
  ReactPostCommandHandler,
  ReactCommentCommandHandler,
];

const queryHandlers: Provider[] = [ViewPostQueryHandler];

const mappers: Provider[] = [MysqlPostMapper];

const repositories: Provider[] = [
  {
    provide: POST_REPOSITORY,
    useClass: MysqlPostRepository,
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
  controllers: [...httpControllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
    ...interceptors,
  ],
})
export class PostModule {}
