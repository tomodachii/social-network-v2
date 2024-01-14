import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MarkAsReadNotificationCommand } from './mark-as-read-notification.command';
import { NotificationRepository } from '@lib/notification/domain';
import { Inject } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY } from '../notification.di-token';

@CommandHandler(MarkAsReadNotificationCommand)
export class MarkAsReadNotificationCommandHandler
  implements ICommandHandler<MarkAsReadNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    protected readonly repo: NotificationRepository
  ) {}

  async execute(command: MarkAsReadNotificationCommand) {
    return await this.repo.markAsRead(command.notificationIds);
  }
}
