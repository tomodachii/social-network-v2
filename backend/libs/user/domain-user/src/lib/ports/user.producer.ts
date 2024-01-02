import { UserEntity } from '../user.entity';

export interface UserProducer {
  publishUserCreatedEvent(user: UserEntity): void;
  publishAvatarUpdatedEvent(user: UserEntity): void;
  publishCoverUpdatedEvent(user: UserEntity): void;
}
