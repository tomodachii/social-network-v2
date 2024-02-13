import { Command, CommandProps } from '@lib/shared/ddd';

export class UnfriendCommand extends Command {
  readonly friendId: string;

  constructor(props: CommandProps<UnfriendCommand>) {
    super(props);
    this.friendId = props.friendId;
  }
}
