import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveNotificationCommand } from './save-notification.command';
import {
  NotificationEntity,
  NotificationGateway,
  NotificationRepository,
} from '@lib/notification/domain';
import { None, Option, Result, Some } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_GATEWAY,
  NOTIFICATION_REPOSITORY,
} from '../notification.di-token';

@CommandHandler(SaveNotificationCommand)
export class SaveNotificationCommandHandler
  implements ICommandHandler<SaveNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: NotificationRepository,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly gateway: NotificationGateway
  ) {}

  async execute(command: SaveNotificationCommand): Promise<Option<boolean>> {
    const notificationResult = Result.safe(() =>
      NotificationEntity.create({
        type: command.type,
        data: command.data,
        userReceivedId: command.userReceivedId,
        userCreatedId: command.userCreatedId,
        isRead: false,
      })
    );

    if (notificationResult.isOk()) {
      const result = await Result.safe(
        this.repo.save(notificationResult.unwrap())
      );

      if (result.isOk()) {
        this.gateway.emitNotificationEvent(notificationResult.unwrap());
      }

      return result.isOk() ? Some(true) : None;
    }
    return None;
  }
}
