import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';
import { RequestContextService } from '@lib/shared/common/application';
import { Err, Result } from 'oxide.ts';
import { UpdatePostCommand } from './update-post.command';
import { PostRepository } from '@lib/post/domain';
import { POST_REPOSITORY } from '../post.di-token';

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler
  implements ICommandHandler<UpdatePostCommand>
{
  constructor(
    @Inject(POST_REPOSITORY)
    protected readonly repo: PostRepository
  ) {}

  async execute(command: UpdatePostCommand): Promise<Result<boolean, Error>> {
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

    for (const attachment of post.attachments) {
      post.removeAttachment(attachment.id);
    }
    const attachments = command.attachments;
    for (const attachment of attachments) {
      post.addAttachment({
        description: attachment.description,
        type: attachment.type,
        id: attachment.id,
        extension: attachment.extension,
        size: attachment.size,
      });
    }

    post.content = command.content;
    post.mode = command.mode;

    const result = await Result.safe(this.repo.savePost(post));

    return result;
  }
}
