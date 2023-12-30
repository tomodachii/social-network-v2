import {
  AvatarUpdatedEvent,
  UserCreatedEvent,
} from '@lib/shared/service-interface';

export interface UserProducer {
  publishUserCreatedEvent(user: UserCreatedEvent): void;
  publishAvatarUpdatedEvent(avatar: AvatarUpdatedEvent): void;
}
