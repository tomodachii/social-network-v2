import { Module, Provider, Logger } from '@nestjs/common';
import { PostMapper } from './post.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../database';
import { PostRepository } from './infrastructure-adapter';
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
  CommentHttpController,
  PostHttpController,
  ReactHttpController,
} from './interface-adapter';
import { UserMessageController } from './interface-adapter/user.message.controller';

const httpControllers = [
  PostHttpController,
  CommentHttpController,
  ReactHttpController,
  UserMessageController,
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

const mappers: Provider[] = [PostMapper];

const repositories: Provider[] = [
  {
    provide: POST_REPOSITORY,
    useClass: PostRepository,
  },
];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [...httpControllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class PostModule {}
