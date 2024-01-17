import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoadPagingDto, MarkAsReadDto, NotificationDto } from '../dtos';
import {
  LoadNotificationQuery,
  LoadTotalUnreadNotificationQuery,
  MarkAsReadNotificationCommand,
} from '@lib/notification/feature';
import { BaseResponse } from '@lib/shared/common/api';
import { Serialize } from '@lib/shared/common/interceptors';

@Controller('notifications/v1')
export class HttpNotificationController {
  constructor(
    protected readonly queryBus: QueryBus,
    protected readonly commandBus: CommandBus
  ) {}

  @Get('')
  @Serialize(NotificationDto)
  async getNotifications(@Query() query: LoadPagingDto) {
    const result = await this.queryBus.execute(
      new LoadNotificationQuery({
        limit: query.limit,
        page: query.page,
      })
    );
    return new BaseResponse(result);
  }

  @Get('total-unread')
  async getTotalUnreadNotifications() {
    const result: number = await this.queryBus.execute(
      new LoadTotalUnreadNotificationQuery()
    );
    return new BaseResponse(result);
  }

  @Put('')
  async markAsRead(@Body() body: MarkAsReadDto) {
    const result = await this.commandBus.execute(
      new MarkAsReadNotificationCommand({
        notificationIds: body.notificationIds,
      })
    );
    return new BaseResponse(result);
  }
}
