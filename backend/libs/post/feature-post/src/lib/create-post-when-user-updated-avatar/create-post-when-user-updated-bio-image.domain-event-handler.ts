import { UserBioImageUpdateDomainEvent } from '@lib/post/replica-user';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { POST_REPOSITORY } from '../post.di-token';
import {
  AttachmentType,
  PostEntity,
  PostMode,
  PostRepository,
} from '@lib/post/domain';

@EventsHandler(UserBioImageUpdateDomainEvent)
export class CreatePostWhenUserUpdatedBioImageDomainEventHandler
  implements IEventHandler<UserBioImageUpdateDomainEvent>
{
  constructor(
    @Inject(POST_REPOSITORY)
    protected readonly repo: PostRepository
  ) {}

  async handle(event: UserBioImageUpdateDomainEvent) {
    const post = PostEntity.create({
      content: '',
      mode: PostMode.Public,
      attachments: [
        {
          description: '',
          type: AttachmentType.Image,
          id: event.fileId,
          extension: event.extension,
          size: event.size,
        },
      ],
      userId: event.aggregateId,
    });

    await this.repo.createPost(post);
  }
}
