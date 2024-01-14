import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  LoadNotificationQueryHandler,
  LoadTotalUnreadNotificationQueryHandler,
  MarkAsReadNotificationCommandHandler,
  NOTIFICATION_REPOSITORY,
  SaveNotificationCommandHandler,
} from '@lib/notification/feature';
import {
  HttpNotificationController,
  KafkaPostConsumer,
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

const repositories: Provider[] = [
  { provide: NOTIFICATION_REPOSITORY, useClass: MongoNotificationRepository },
];

const jobs = [CleanNotificationAfterDateJob];

@Module({
  imports: [CqrsModule, DataAccessNotificationModule, ScheduleModule.forRoot()],
  controllers: [...httpControllers, ...consumers],
  providers: [
    Logger,
    ...jobs,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class NotificationModule {}
