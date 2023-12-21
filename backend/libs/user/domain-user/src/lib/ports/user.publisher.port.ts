import { UserCreatedEvent } from '../events';

export interface UserPublisherPort {
  publishUserCreatedEvent(user: UserCreatedEvent): void;
}
