import { SaveUserReplicaCommand } from '@lib/post/replica-user';
import { UserCreatedEvent, UserPattern } from '@lib/shared/service-interface';
import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern } from '@nestjs/microservices';
import { nanoid } from 'nanoid';

@Controller()
export class KafkaUserConsumer {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: Logger
  ) {}

  @EventPattern(UserPattern.UserCreated)
  async handleUserCreatedEvent(data: UserCreatedEvent) {
    this.commandBus.execute(
      new SaveUserReplicaCommand({
        userId: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        version: data.version,
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
}
