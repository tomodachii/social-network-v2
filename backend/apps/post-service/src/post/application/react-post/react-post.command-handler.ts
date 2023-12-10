import { Inject } from '@nestjs/common';
import { AttachmentEntity, PostRepositoryPort } from '../../domain';
import { POST_REPOSITORY } from '../../post.di-token';
import { CommandHandler } from '@nestjs/cqrs';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';
import { RequestContextService } from '@lib/shared/common/application';
import { Err, Result } from 'oxide.ts';
import { ReactPostDto } from './react-post.dto';

@CommandHandler(ReactPostDto)
export class ReactPostCommandHandler {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly repo: PostRepositoryPort
  ) {}

  async execute(command: ReactPostDto) {
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

    return result;
  }
}
