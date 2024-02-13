import { CommandProps, Command } from '@lib/shared/ddd';

export class AddFriendCommand extends Command {
  readonly friendId: string;

  constructor(props: CommandProps<AddFriendCommand>) {
    super(props);
    this.friendId = props.friendId;
  }
}
