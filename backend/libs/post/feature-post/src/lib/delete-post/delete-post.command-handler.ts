import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';
import { Err, Result } from 'oxide.ts';
import { RequestContextService } from '@lib/shared/common/application';
import { POST_REPOSITORY } from '../post.di-token';
import { PostRepository } from '@lib/post/domain';

export class DeletePostCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostCommand>
{
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly repo: PostRepository
  ) {}

  async execute(command: DeletePostCommand): Promise<Result<boolean, Error>> {
    const postOption = await this.repo.findPostById(command.id);
    if (postOption.isNone()) {
      return Err(new Exception('Cannot find post', HttpStatus.BAD_REQUEST));
    }
    const post = postOption.unwrap();
    const userId = RequestContextService.getUserId();
    if (post.userId !== userId) {
      return Err(
        new Exception(
          'You are not allowed to delete this post',
          HttpStatus.FORBIDDEN
        )
      );
    }

    const result = await Result.safe(this.repo.deletePost(post));

    return result;
  }
}
