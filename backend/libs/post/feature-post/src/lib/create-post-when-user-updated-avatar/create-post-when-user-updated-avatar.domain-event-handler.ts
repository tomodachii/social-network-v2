import { UserAvatarUpdatedDomainEvent } from '@lib/post/replica-user';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { POST_REPOSITORY } from '../post.di-token';
import { PostEntity, PostMode, PostRepository } from '@lib/post/domain';
import { Result } from 'oxide.ts';

@EventsHandler(UserAvatarUpdatedDomainEvent)
export class CreatePostWhenUserUpdatedAvatarDomainEventHandler
  implements IEventHandler<UserAvatarUpdatedDomainEvent>
{
  constructor(
    @Inject(POST_REPOSITORY)
    protected readonly repo: PostRepository
  ) {}

  async handle(event: UserAvatarUpdatedDomainEvent) {
    const post = PostEntity.create({
      content: '',
      mode: PostMode.Public,
      attachments: [],
      userId: event.aggregateId,
    });

    // const isExistAttachments =
    //   !Guard.isEmpty(command.attachments) &&
    //   (await this.repo.checkExistAttachmentsByIds(
    //     command.attachments?.map((attachment) => attachment.id)
    //   ));

    // if (isExistAttachments) {
    //   return Err(
    //     new Exception(
    //       'Attachments belong to other post',
    //       HttpStatus.BAD_REQUEST
    //     )
    //   );
    // }

    // if (!Guard.isEmpty(command.attachments))
    //   for (let attachment of command.attachments) {
    //     post.addAttachment({
    //       description: attachment.description,
    //       type: attachment.type,
    //       id: attachment.id,
    //       name: attachment.name,
    //       size: attachment.size,
    //     });
    //   }
    this.repo.createPost(post);
    // await Result.safe();

    // if (result.isErr()) {
    //   return result;
    // }
  }
}
