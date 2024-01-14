import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationSchema,
  NotificationDocument,
} from './notification.document';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:123456@localhost:27018/notification_db?authSource=admin'
    ),
    MongooseModule.forFeature([
      { name: NotificationDocument.name, schema: NotificationSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DataAccessNotificationModule {}
