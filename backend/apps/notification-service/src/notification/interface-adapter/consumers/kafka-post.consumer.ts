import {
  CommentCreatedEvent,
  PostCreatedEvent,
  PostPattern,
  PostReactedEvent,
} from '@lib/shared/service-interface';
import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern } from '@nestjs/microservices';
import { nanoid } from 'nanoid';
import { SaveNotificationCommand } from '@lib/notification/feature';
import { NotificationType } from '@lib/notification/domain';

@Controller()
export class KafkaPostConsumer {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: Logger
  ) {}

  @EventPattern(PostPattern.PostCreated)
  async handlePostCreatedEvent(data: PostCreatedEvent) {
    this.commandBus.execute(
      new SaveNotificationCommand({
        data: data,
        type: NotificationType.PostCreated,
        userCreatedId: data.userId,
        userReceivedId: data.userId,
        metadata: {
          correlationId: nanoid(6),
          timestamp: Date.now(),
        },
      })
    );

    this.logger.log(
      `Post created event received: ${JSON.stringify(data)}`,
      'notification-service'
    );
  }

  @EventPattern(PostPattern.CommentCreated)
  async handleCommentCreatedEvent(data: CommentCreatedEvent) {
    this.commandBus.execute(
      new SaveNotificationCommand({
        data: data,
        type: NotificationType.CommentCreated,
        userCreatedId: data.userId,
        userReceivedId: data.userId,
        metadata: {
          correlationId: nanoid(6),
          timestamp: Date.now(),
        },
      })
    );

    this.logger.log(
      `Comment created event received: ${JSON.stringify(data)}`,
      'notification-service'
    );
  }

  @EventPattern(PostPattern.PostReacted)
  async handlePostReactedEvent(data: PostReactedEvent) {
    console.log('handlePostReactedEvent');
    this.commandBus.execute(
      new SaveNotificationCommand({
        data: data,
        type: NotificationType.PostReacted,
        userCreatedId: data.userId,
        userReceivedId: data.userId,
        metadata: {
          correlationId: nanoid(6),
          timestamp: Date.now(),
        },
      })
    );

    this.logger.log(
      `Post reacted event received: ${JSON.stringify(data)}`,
      'notification-service'
    );
  }
}
