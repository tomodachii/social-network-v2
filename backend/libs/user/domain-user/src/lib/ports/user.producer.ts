import { UserCreatedEvent } from '@lib/shared/service-interface';

export interface UserProducer {
  publishUserCreatedEvent(user: UserCreatedEvent): void;
}
