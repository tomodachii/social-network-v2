import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  LoadNotificationQueryHandler,
  LoadTotalUnreadNotificationQueryHandler,
  MarkAsReadNotificationCommandHandler,
  NOTIFICATION_GATEWAY,
  NOTIFICATION_REPOSITORY,
  SaveNotificationCommandHandler,
} from '@lib/notification/feature';
import {
  HttpNotificationController,
  KafkaPostConsumer,
  WebSocketNotificationGateway,
} from './interface-adapter';
import { DataAccessNotificationModule } from '@lib/notification/data-access';
import { ScheduleModule } from '@nestjs/schedule';
import {
  MongoNotificationRepository,
  CleanNotificationAfterDateJob,
  MongoNotificationMapper,
} from './infrastructure-adapter';

const httpControllers = [HttpNotificationController];

const consumers = [KafkaPostConsumer];

const commandHandlers: Provider[] = [
  SaveNotificationCommandHandler,
  MarkAsReadNotificationCommandHandler,
];

const queryHandlers: Provider[] = [
  LoadNotificationQueryHandler,
  LoadTotalUnreadNotificationQueryHandler,
];

const mappers: Provider[] = [MongoNotificationMapper];

const infra: Provider[] = [
  { provide: NOTIFICATION_REPOSITORY, useClass: MongoNotificationRepository },
  { provide: NOTIFICATION_GATEWAY, useClass: WebSocketNotificationGateway },
];

const jobs = [CleanNotificationAfterDateJob];

@Module({
  imports: [CqrsModule, DataAccessNotificationModule, ScheduleModule.forRoot()],
  controllers: [...httpControllers, ...consumers],
  providers: [
    Logger,
    ...jobs,
    ...infra,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class NotificationModule {}
