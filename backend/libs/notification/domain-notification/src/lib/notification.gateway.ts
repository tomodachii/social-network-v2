import { NotificationEntity } from './notification.entity';

export interface NotificationGateway {
  emitNotificationEvent(data: NotificationEntity): void;
}
