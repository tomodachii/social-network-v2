import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestContextService } from '@lib/shared/common/application';
import { Err, Ok, Result } from 'oxide.ts';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';
import { CreatePostCommand } from './create-post.command';
import { PostEntity, PostProducer, PostRepository } from '@lib/post/domain';
import { POST_PRODUCER, POST_REPOSITORY } from '../post.di-token';
import { Guard } from '@lib/shared/common/utils';

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  constructor(
    @Inject(POST_REPOSITORY)
    protected readonly repo: PostRepository,
    @Inject(POST_PRODUCER)
    protected readonly producer: PostProducer
  ) {}

  async execute(command: CreatePostCommand): Promise<Result<string, Error>> {
    let originalPost: PostEntity | undefined = undefined;

    if (command.originalPostId) {
      const originalPostOption = await this.repo.findPostById(
        command.originalPostId
      );
      if (originalPostOption.isNone()) {
        return Err(
          new Exception('Original post not found', HttpStatus.NOT_FOUND)
        );
      }

      originalPost = originalPostOption.unwrap();
    }

    const post = PostEntity.create({
      content: command.content,
      mode: command.mode,
      attachments: [],
      originalPost: originalPost,
      userId: RequestContextService.getUserId(),
    });

    if (!Guard.isEmpty(command.attachments))
      for (const attachment of command.attachments) {
        post.addAttachment({
          description: attachment.description,
          type: attachment.type,
          id: attachment.id,
          extension: attachment.extension,
          size: attachment.size,
        });
      }

    const result = await Result.safe(this.repo.createPost(post));

    if (result.isErr()) {
      return result;
    }

    this.producer.publishPostCreatedEvent(post);

    return Ok(post.id);
  }
}
