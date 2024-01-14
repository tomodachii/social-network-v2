import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';

export class MarkAsReadNotificationCommand extends Command {
  readonly notificationIds: AggregateID[];

  constructor(props: CommandProps<MarkAsReadNotificationCommand>) {
    super(props);
    this.notificationIds = props.notificationIds;
  }
}
