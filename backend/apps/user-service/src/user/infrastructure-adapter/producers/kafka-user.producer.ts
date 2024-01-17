import {
  AvatarUpdatedEvent,
  CoverUpdatedEvent,
  UserCreatedEvent,
  UserPattern,
} from '@lib/shared/service-interface';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UserEntity, UserProducer } from '@lib/user/domain';
import { USER_KAFKA_CLIENT } from '@lib/user/feature';

export class KafkaUserProducer implements UserProducer {
  constructor(
    @Inject(USER_KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    private logger: Logger
  ) {}

  publishUserCreatedEvent(user: UserEntity): void {
    const eventData: UserCreatedEvent = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    this.kafkaClient.emit(UserPattern.UserCreated, JSON.stringify(eventData));
    this.logger.log(
      `User created event published: ${JSON.stringify(eventData)}`,
      'user-service'
    );
  }

  async publishAvatarUpdatedEvent(user: UserEntity): Promise<void> {
    const eventData: AvatarUpdatedEvent = {
      userId: user.id,
      avatarFileId: user.avatar.id,
      version: 0,
      extension: user.avatar.getPropsCopy().extension,
      size: user.avatar.getPropsCopy().size,
    };
    this.kafkaClient.emit(UserPattern.AvatarUpdated, JSON.stringify(eventData));
    this.logger.log(
      `Avatar updated event published: ${JSON.stringify(eventData)}`,
      'user-service'
    );
  }

  publishCoverUpdatedEvent(user: UserEntity): void {
    const eventData: CoverUpdatedEvent = {
      userId: user.id,
      coverFileId: user.cover.id,
      version: 0,
      extension: user.cover.getPropsCopy().extension,
      size: user.cover.getPropsCopy().size,
    };
    this.kafkaClient.emit(UserPattern.CoverUpdated, JSON.stringify(eventData));
    this.logger.log(
      `Cover updated event published: ${JSON.stringify(eventData)}`,
      'user-service'
    );
  }
}
