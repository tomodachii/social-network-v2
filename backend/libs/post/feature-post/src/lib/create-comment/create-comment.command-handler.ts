import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';
import { RequestContextService } from '@lib/shared/common/application';
import { Err, Ok, Result } from 'oxide.ts';
import { CreateCommentCommand } from './create-comment.command';
import { POST_REPOSITORY } from '../post.di-token';
import { CreateAttachmentProps, PostRepository } from '@lib/post/domain';

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly repo: PostRepository
  ) {}
  async execute(command: CreateCommentCommand): Promise<Result<string, Error>> {
    const postOption = await this.repo.findPostById(command.postId);
    if (postOption.isNone()) {
      return Err(new Exception('Cannot find post', HttpStatus.BAD_REQUEST));
    }
    const post = postOption.unwrap();

    const attachments =
      command.attachments?.map((attachment) => {
        const createAttachmentProps: CreateAttachmentProps = {
          id: attachment.id,
          type: attachment.type,
          description: attachment.description,
          extension: attachment.extension,
          size: attachment.size,
        };
        return createAttachmentProps;
      }) || [];

    let commentId: string;
    if (command.replyTo === command.postId) {
      commentId = post.addComment({
        content: command.content,
        userId: RequestContextService.getUserId(),
        attachments: attachments,
      });
    } else {
      commentId = post.addReplyToComment(command.replyTo, {
        content: command.content,
        userId: RequestContextService.getUserId(),
        attachments: attachments,
      });
    }

    const result = await Result.safe(this.repo.savePost(post));
    if (result.isErr()) {
      return result;
    }

    return Ok(commentId);
  }
}
