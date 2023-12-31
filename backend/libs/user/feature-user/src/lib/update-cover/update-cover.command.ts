import { Command, CommandProps } from '@lib/shared/ddd-v2';

export class UpdateCoverCommand extends Command {
  readonly fileId: string;
  readonly extension: string;
  readonly size: number;

  constructor(props: CommandProps<UpdateCoverCommand>) {
    super(props);
    this.fileId = props.fileId;
    this.extension = props.extension;
    this.size = props.size;
  }
}
