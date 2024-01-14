import { AggregateID } from '@lib/shared/ddd-v2';
import { NotificationEntity } from './notification.entity';

export interface NotificationRepository {
  save(data: NotificationEntity): Promise<boolean>;
  markAsRead(ids: AggregateID[]): Promise<boolean>;
}
