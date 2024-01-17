import { ObjectLiteral } from '@lib/shared/common/types';
import {
  AggregateID,
  AggregateRoot,
  AggregateRootProps,
} from '@lib/shared/ddd-v2';
import { v4 } from 'uuid';
import { NotificationData, NotificationType } from './notification.type';

export interface NotificationProps extends AggregateRootProps {
  userReceivedId: AggregateID;
  userCreatedId: AggregateID;
  type: NotificationType;
  data: NotificationData<NotificationType>;
  isRead: boolean;
  version: number;
}

export interface CreateNotificationProps {
  userReceivedId: AggregateID;
  userCreatedId: AggregateID;
  type: NotificationType;
  data: NotificationData<NotificationType>;
  isRead: boolean;
}

export class NotificationEntity extends AggregateRoot<NotificationProps> {
  static create(create: CreateNotificationProps): NotificationEntity {
    const props: NotificationProps = {
      ...create,
      version: 0,
    };
    return new NotificationEntity({ id: v4(), props });
  }

  get userReceivedId(): AggregateID {
    return this.props.userReceivedId;
  }

  get userCreatedId(): AggregateID {
    return this.props.userCreatedId;
  }

  get type(): NotificationType {
    return this.props.type;
  }

  get data(): ObjectLiteral {
    return this.props.data;
  }

  get isRead(): boolean {
    return this.props.isRead;
  }

  markAsRead(): void {
    this.props.isRead = true;
  }

  public override validate(): void {
    return;
  }
}
