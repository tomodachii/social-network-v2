import { NotificationDocument } from '@lib/notification/data-access';
import { RequestContextService } from '@lib/shared/common/application';
import { QueryBase } from '@lib/shared/ddd-v2';
import { QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class LoadTotalUnreadNotificationQuery extends QueryBase {}

@QueryHandler(LoadTotalUnreadNotificationQuery)
export class LoadTotalUnreadNotificationQueryHandler {
  constructor(
    @InjectModel(NotificationDocument.name)
    protected readonly model: Model<NotificationDocument>
  ) {}

  async execute() {
    return this.model.countDocuments({
      userReceivedId: RequestContextService.getUserId(),
      isRead: false,
    });
  }
}
