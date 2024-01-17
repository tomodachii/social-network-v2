import { AggregateID } from '@lib/shared/ddd-v2';
import { NotificationType } from './notification.type';

interface User {
  readonly id: AggregateID;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatarFileId: AggregateID;
}

export interface NotificationCreatedEvent {
  readonly id: AggregateID;
  readonly userReceivedId: AggregateID;
  readonly userCreated?: User;
  readonly type: NotificationType;
  readonly data: object;
}
