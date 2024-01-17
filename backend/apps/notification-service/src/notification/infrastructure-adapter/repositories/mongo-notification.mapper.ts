import { NotificationDocument } from '@lib/notification/data-access';
import {
  NotificationData,
  NotificationEntity,
  NotificationType,
} from '@lib/notification/domain';
import { Mapper } from '@lib/shared/ddd-v2';

export class MongoNotificationMapper
  implements Mapper<NotificationEntity, NotificationDocument>
{
  toDomain(document: NotificationDocument): NotificationEntity {
    const domain = new NotificationEntity({
      id: document.id,
      props: {
        userReceivedId: document.userReceivedId,
        userCreatedId: document.userCreatedId,
        type: document.type,
        data: document.data as NotificationData<NotificationType>,
        isRead: false,
        version: document.version,
      },
    });
    return domain;
  }

  toPersistence(entity: NotificationEntity): NotificationDocument {
    return {
      id: entity.id,
      userReceivedId: entity.userReceivedId,
      userCreatedId: entity.userCreatedId,
      type: entity.type,
      isRead: entity.isRead,
      data: entity.data,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      version: entity.version,
    };
  }
}
