import { Command, CommandProps } from '@lib/shared/ddd';

export class UnblockCommand extends Command {
  readonly userBlockId: string;

  constructor(props: CommandProps<UnblockCommand>) {
    super(props);
    this.userBlockId = props.userBlockId;
  }
}
