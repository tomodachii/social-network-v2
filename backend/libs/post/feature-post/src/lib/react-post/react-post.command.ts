import { ReactType } from '@lib/post/domain';
import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';

export class ReactPostCommand extends Command {
  readonly postId: AggregateID;
  readonly type: ReactType;
  readonly isUnReact: boolean;

  constructor(props: CommandProps<ReactPostCommand>) {
    super(props);
    this.postId = props.postId;
    this.type = props.type;
    this.isUnReact = props.isUnReact;
  }
}
