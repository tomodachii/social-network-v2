import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';
import { RequestContextService } from '@lib/shared/common/application';
import { Err, Result } from 'oxide.ts';
import { POST_REPOSITORY } from '../post.di-token';
import { PostRepository } from '@lib/post/domain';
import { ReactCommentCommand } from './react-comment.command';

@CommandHandler(ReactCommentCommand)
export class ReactCommentCommandHandler {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly repo: PostRepository
  ) {}

  async execute(command: ReactCommentCommand) {
    const postOption = await this.repo.findPostById(command.postId);
    if (postOption.isNone()) {
      return Err(new Exception('Cannot find post', HttpStatus.BAD_REQUEST));
    }

    const post = postOption.unwrap();

    if (command.isUnReact) {
      post.removeReactOfComment(command.commentId, command.replyTo);
    } else {
      post.addReactOfComment(command.commentId, command.replyTo, {
        type: command.type,
        userId: RequestContextService.getUserId(),
      });
    }

    const result = await Result.safe(this.repo.savePost(post));

    return result;
  }
}
