import { PostEntity, PostProducer, ReactType } from '@lib/post/domain';
import { POST_KAFKA_CLIENT } from '@lib/post/feature';
import { AggregateID } from '@lib/shared/ddd-v2';
import {
  CommentCreatedEvent,
  PostCreatedEvent,
  PostPattern,
  PostReactedEvent,
} from '@lib/shared/service-interface';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export class KafkaPostProducer implements PostProducer {
  constructor(
    @Inject(POST_KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    private logger: Logger
  ) {}

  publishPostReactedEvent(
    post: PostEntity,
    reactType: ReactType,
    userId: AggregateID
  ): void {
    const eventData: PostReactedEvent = {
      id: post.id,
      postId: post.id,
      react: reactType,
      userId: userId,
    };

    this.kafkaClient.emit(PostPattern.PostReacted, JSON.stringify(eventData));
    this.logger.log(
      `Post reacted event published: ${JSON.stringify(eventData)}`,
      'post-service'
    );
  }

  publishCommentCreatedEvent(
    post: PostEntity,
    commentId: AggregateID,
    replyTo: AggregateID
  ): void {
    const updatedComment =
      replyTo === post.id
        ? post.comments.find((c) => c.id === commentId)
        : post.comments
            .find((c) => c.id === replyTo)
            ?.replies.find((r) => r.id === commentId);
    if (!updatedComment) return;

    const eventData: CommentCreatedEvent = {
      id: updatedComment.id,
      replyTo: replyTo,
      postId: post.id,
      content: updatedComment.content,
      userId: updatedComment.userId,
    };
    this.kafkaClient.emit(
      PostPattern.CommentCreated,
      JSON.stringify(eventData)
    );
    this.logger.log(
      `Comment created event published: ${JSON.stringify(eventData)}`,
      'post-service'
    );
  }

  publishPostCreatedEvent(post: PostEntity): void {
    const eventData: PostCreatedEvent = {
      id: post.id,
      content: post.content,
      userId: post.userId,
      originalPostId: post.originalPost?.id,
    };
    this.kafkaClient.emit(PostPattern.PostCreated, JSON.stringify(eventData));
    this.logger.log(
      `Post created event published: ${JSON.stringify(eventData)}`,
      'post-service'
    );
  }
}
