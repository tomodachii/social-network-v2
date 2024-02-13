import { Command, CommandProps } from '@lib/shared/ddd';

export class FollowCommand extends Command {
  readonly followeeId: string;

  constructor(props: CommandProps<FollowCommand>) {
    super(props);
    this.followeeId = props.followeeId;
  }
}
