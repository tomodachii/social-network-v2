import { Command, CommandProps } from '@lib/shared/ddd';

export class BlockCommand extends Command {
  readonly userBlockId: string;

  constructor(props: CommandProps<BlockCommand>) {
    super(props);
    this.userBlockId = props.userBlockId;
  }
}
