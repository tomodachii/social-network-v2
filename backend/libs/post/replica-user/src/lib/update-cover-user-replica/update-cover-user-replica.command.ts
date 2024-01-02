import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';

export class UpdateCoverUserReplicaCommand extends Command {
  readonly userId: AggregateID;
  readonly coverFileId: AggregateID;
  readonly version: number;
  readonly size: number;
  readonly extension: string;

  constructor(props: CommandProps<UpdateCoverUserReplicaCommand>) {
    super(props);
    this.userId = props.userId;
    this.coverFileId = props.coverFileId;
    this.version = props.version;
    this.size = props.size;
    this.extension = props.extension;
  }
}
