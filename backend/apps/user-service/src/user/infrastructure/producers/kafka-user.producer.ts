import { UserCreatedEvent, UserPattern } from '@lib/shared/service-interface';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UserProducer } from '@lib/user/domain';
import { USER_KAFKA_CLIENT } from '@lib/user/feature';

export class KafkaUserProducer implements UserProducer {
  constructor(
    @Inject(USER_KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    private logger: Logger
  ) {}

  publishUserCreatedEvent(user: UserCreatedEvent): void {
    this.kafkaClient.emit(UserPattern.UserCreated, JSON.stringify(user));
    this.logger.log(
      `User created event published: ${JSON.stringify(user)}`,
      'user-service'
    );
  }
}
