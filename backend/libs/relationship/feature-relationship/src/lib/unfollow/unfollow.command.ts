import { Command, CommandProps } from '@lib/shared/ddd';

export class UnfollowCommand extends Command {
  readonly followeeId: string;

  constructor(props: CommandProps<UnfollowCommand>) {
    super(props);
    this.followeeId = props.followeeId;
  }
}
