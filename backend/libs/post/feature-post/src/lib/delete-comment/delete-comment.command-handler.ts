import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';
import { Err, Result } from 'oxide.ts';
import { RequestContextService } from '@lib/shared/common/application';
import { DeleteCommentCommand } from './delete-comment.command';
import { POST_REPOSITORY } from '../post.di-token';
import { PostRepository } from '@lib/post/domain';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCommandHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly repo: PostRepository
  ) {}

  async execute(
    command: DeleteCommentCommand
  ): Promise<Result<boolean, Error>> {
    const postOption = await this.repo.findPostById(command.postId);
    if (postOption.isNone()) {
      return Err(new Exception('Cannot find post', HttpStatus.BAD_REQUEST));
    }
    const post = postOption.unwrap();
    const userId = RequestContextService.getUserId();

    if (command.replyTo === command.postId) {
      const removedComment = post.getComment(command.commentId);

      if (post.userId !== userId || removedComment.userId !== userId) {
        return Err(
          new Exception(
            'You are not allowed to delete this comment',
            HttpStatus.FORBIDDEN
          )
        );
      }
      post.removeComment(command.commentId);
    } else {
      const removedReply = post.getReplyToComment(
        command.replyTo,
        command.commentId
      );

      if (post.userId !== userId || removedReply.userId !== userId) {
        return Err(
          new Exception(
            'You are not allowed to delete this comment',
            HttpStatus.FORBIDDEN
          )
        );
      }
      post.removeReplyToComment(command.replyTo, command.commentId);
    }

    const result = await Result.safe(this.repo.savePost(post));

    return result;
  }
}
