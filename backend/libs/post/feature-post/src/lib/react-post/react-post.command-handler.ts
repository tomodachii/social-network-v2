import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';
import { RequestContextService } from '@lib/shared/common/application';
import { Err, Result } from 'oxide.ts';
import { ReactPostCommand } from './react-post.command';
import { POST_PRODUCER, POST_REPOSITORY } from '../post.di-token';
import { PostProducer, PostRepository } from '@lib/post/domain';

@CommandHandler(ReactPostCommand)
export class ReactPostCommandHandler {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly repo: PostRepository,
    @Inject(POST_PRODUCER)
    private readonly producer: PostProducer
  ) {}

  async execute(command: ReactPostCommand) {
    const postOption = await this.repo.findPostById(command.postId);
    if (postOption.isNone()) {
      return Err(new Exception('Cannot find post', HttpStatus.BAD_REQUEST));
    }

    const post = postOption.unwrap();

    if (command.isUnReact) {
      post.removeReact(RequestContextService.getUserId());
    } else {
      post.addReact({
        type: command.type,
        userId: RequestContextService.getUserId(),
      });
    }

    const result = await Result.safe(this.repo.savePost(post));
    if (result.isErr()) {
      return result;
    }

    !command.isUnReact &&
      this.producer.publishPostReactedEvent(
        post,
        command.type,
        RequestContextService.getUserId()
      );
    return result;
  }
}
