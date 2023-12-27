import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';

export class SaveUserReplicaCommand extends Command {
  readonly userId: AggregateID;
  readonly firstName: string;
  readonly lastName: string;
  readonly version: number;

  constructor(props: CommandProps<SaveUserReplicaCommand>) {
    super(props);
    this.userId = props.userId;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.version = props.version;
  }
}
