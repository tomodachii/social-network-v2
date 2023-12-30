import {
  SaveUserReplicaCommand,
  UpdateAvatarUserReplicaCommand,
  UserAvatarUpdatedDomainEvent,
} from '@lib/post/replica-user';
import {
  AvatarUpdatedEvent,
  UserCreatedEvent,
  UserPattern,
} from '@lib/shared/service-interface';
import { Controller, Logger } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventPattern } from '@nestjs/microservices';
import { nanoid } from 'nanoid';

@Controller()
export class KafkaUserConsumer {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly logger: Logger
  ) {}

  @EventPattern(UserPattern.UserCreated)
  async handleUserCreatedEvent(data: UserCreatedEvent) {
    this.commandBus.execute(
      new SaveUserReplicaCommand({
        userId: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        version: 0,
        metadata: {
          correlationId: nanoid(6),
          timestamp: Date.now(),
        },
      })
    );

    this.logger.log(
      `User created event received: ${JSON.stringify(data)}`,
      'post-service'
    );
  }

  @EventPattern(UserPattern.AvatarUpdated)
  async handleAvatarUpdatedEvent(data: AvatarUpdatedEvent) {
    this.commandBus.execute(
      new UpdateAvatarUserReplicaCommand({
        userId: data.userId,
        avatarFileId: data.avatarFileId,
        version: data.version,
        metadata: {
          correlationId: nanoid(6),
          timestamp: Date.now(),
        },
      })
    );

    this.logger.log(
      `Avatar updated event received: ${JSON.stringify(data)}`,
      'post-service'
    );

    this.eventBus.publish(
      new UserAvatarUpdatedDomainEvent({
        avatarFileId: data.avatarFileId,
        size: data.size,
        aggregateId: data.userId,
      })
    );
  }
}
