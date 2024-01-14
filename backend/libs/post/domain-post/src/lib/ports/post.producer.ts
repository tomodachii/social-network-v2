import { AggregateID } from '@lib/shared/ddd-v2';
import { PostEntity } from '../post.entity';
import { ReactType } from '../post.type';

export interface PostProducer {
  publishPostCreatedEvent(post: PostEntity): void;
  publishCommentCreatedEvent(
    post: PostEntity,
    commentId: AggregateID,
    replyTo: AggregateID
  ): void;
  publishPostReactedEvent(
    post: PostEntity,
    reactType: ReactType,
    userId: AggregateID
  ): void;
}
