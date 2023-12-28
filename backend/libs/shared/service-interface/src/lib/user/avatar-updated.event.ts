import { AggregateID } from '@lib/shared/ddd-v2';
export interface AvatarUpdatedEvent {
  userId: AggregateID;
  avatarFileId: AggregateID;
  size: number;
  version: number;
}
