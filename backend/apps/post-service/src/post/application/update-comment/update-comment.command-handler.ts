import { Inject } from '@nestjs/common';
import { AttachmentEntity, PostRepositoryPort } from '../../domain';
import { POST_REPOSITORY } from '../../post.di-token';
import { CommandHandler } from '@nestjs/cqrs';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';
import { RequestContextService } from '@lib/shared/common/application';
import { Err, Result } from 'oxide.ts';
import { UpdateCommentDto } from './update-comment.dto';

@CommandHandler(UpdateCommentDto)
export class UpdateCommentCommandHandler {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly repo: PostRepositoryPort
  ) {}
  async execute(command: UpdateCommentDto) {
    const postOption = await this.repo.findPostById(command.postId);
    if (postOption.isNone()) {
      return Err(new Exception('Cannot find post', HttpStatus.BAD_REQUEST));
    }
    const post = postOption.unwrap();

    if (post.userId !== RequestContextService.getUserId()) {
      return Err(
        new Exception(
          'You do not have permission to update this post',
          HttpStatus.FORBIDDEN
        )
      );
    }

    const attachments =
      command.attachments?.map((attachment) =>
        AttachmentEntity.create(attachment)
      ) || [];

    if (command.replyTo === command.postId) {
      post.updateComment(command.commentId, {
        content: command.content,
        userId: RequestContextService.getUserId(),
        attachments: attachments,
      });
    } else {
      post.updateReplyToComment(command.replyTo, command.commentId, {
        content: command.content,
        userId: RequestContextService.getUserId(),
        attachments: attachments,
      });
    }

    const result = await Result.safe(this.repo.savePost(post));

    return result;
  }
}
