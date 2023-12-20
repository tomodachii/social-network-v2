import { Command, CommandProps } from '@lib/shared/ddd-v2';

export class UpdateAvatarCommand extends Command {
  readonly fileId: string;
  readonly userId: string;
  readonly extension: string;
  readonly size: number;

  constructor(props: CommandProps<UpdateAvatarCommand>) {
    super(props);
    this.fileId = props.fileId;
    this.userId = props.userId;
    this.extension = props.extension;
    this.size = props.size;
  }
}
