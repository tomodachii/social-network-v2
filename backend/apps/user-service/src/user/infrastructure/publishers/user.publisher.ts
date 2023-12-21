import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UserCreatedEvent, UserPublisherPort } from '@lib/user/domain';
import { USER_KAFKA_CLIENT } from '../../user.di-token';

export class UserPublisher implements UserPublisherPort {
  constructor(
    @Inject(USER_KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    private logger: Logger
  ) {}

  publishUserCreatedEvent(user: UserCreatedEvent): void {
    this.kafkaClient.emit('user.created', user);
    this.logger.log(
      `User created event published: ${JSON.stringify(user)}`,
      'user-service'
    );
  }
}
