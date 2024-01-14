import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';
import { NotificationData, NotificationType } from '@lib/notification/domain';

export class SaveNotificationCommand extends Command {
  readonly type: NotificationType;
  readonly data: NotificationData<NotificationType>;
  readonly userReceivedId: AggregateID;
  readonly userCreatedId: AggregateID;

  constructor(props: CommandProps<SaveNotificationCommand>) {
    super(props);
    this.type = props.type;
    this.data = props.data;
    this.userReceivedId = props.userReceivedId;
    this.userCreatedId = props.userCreatedId;
  }
}
