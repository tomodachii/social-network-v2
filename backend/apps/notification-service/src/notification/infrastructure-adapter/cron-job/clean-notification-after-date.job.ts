import { NotificationDocument } from '@lib/notification/data-access';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';

@Injectable()
export class CleanNotificationAfterDateJob {
  constructor(
    private readonly logger: Logger,
    @InjectModel(NotificationDocument.name)
    private readonly model: Model<NotificationDocument>
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    const oneWeekMilliSecond = 7 * 24 * 60 * 60 * 1000;
    this.model
      .deleteMany({
        createdAt: { $lte: new Date(Date.now() - oneWeekMilliSecond) },
      })
      .exec();
    this.logger.log('Called each 1 hour');
  }
}
