import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';

export class UpdateAvatarUserReplicaCommand extends Command {
  readonly userId: AggregateID;
  readonly avatarFileId: AggregateID;
  readonly version: number;
  readonly size: number;
  readonly extension: string;

  constructor(props: CommandProps<UpdateAvatarUserReplicaCommand>) {
    super(props);
    this.userId = props.userId;
    this.avatarFileId = props.avatarFileId;
    this.version = props.version;
    this.size = props.size;
    this.extension = props.extension;
  }
}
