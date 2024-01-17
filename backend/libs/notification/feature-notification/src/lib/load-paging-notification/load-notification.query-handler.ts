import { PaginatedQuery } from '@lib/shared/ddd-v2';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDocument } from '@lib/notification/data-access';
import { RequestContextService } from '@lib/shared/common/application';

export class LoadNotificationQuery extends PaginatedQuery {}

@QueryHandler(LoadNotificationQuery)
export class LoadNotificationQueryHandler
  implements IQueryHandler<LoadNotificationQuery>
{
  constructor(
    @InjectModel(NotificationDocument.name)
    protected readonly model: Model<NotificationDocument>
  ) {}
  async execute(query: LoadNotificationQuery) {
    return await this.model
      .find({ userReceivedId: RequestContextService.getUserId() })
      .skip(query.offset)
      .limit(query.limit);
  }
}
