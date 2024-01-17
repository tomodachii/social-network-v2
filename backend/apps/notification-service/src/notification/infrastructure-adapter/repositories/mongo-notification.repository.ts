import { NotificationDocument } from '@lib/notification/data-access';
import {
  NotificationEntity,
  NotificationRepository,
} from '@lib/notification/domain';
import { AggregateID, BaseRepository } from '@lib/shared/ddd-v2';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoNotificationMapper } from './mongo-notification.mapper';
import { EventBus } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MongoNotificationRepository
  extends BaseRepository<NotificationEntity, NotificationDocument>
  implements NotificationRepository
{
  constructor(
    protected readonly mapper: MongoNotificationMapper,
    protected readonly eventBus: EventBus,
    protected readonly logger: Logger,
    @InjectModel(NotificationDocument.name)
    protected readonly model: Model<NotificationDocument>
  ) {
    super(mapper, eventBus, logger);
  }

  async markAsRead(ids: AggregateID[]): Promise<boolean> {
    const result = await this.model.updateMany(
      {
        id: {
          $in: ids,
        },
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return result.modifiedCount > 0;
  }

  async save(data: NotificationEntity): Promise<boolean> {
    const result = await this.model.findOneAndUpdate(
      {
        id: data.id,
      },
      {
        $set: {
          id: data.id,
          userReceivedId: data.userReceivedId,
          userCreatedId: data.userCreatedId,
          type: data.type,
          data: data.data,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    return result !== null;
  }
}
