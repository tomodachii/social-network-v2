import { ReactType } from '@lib/post/domain';
import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';

export class ReactCommentCommand extends Command {
  readonly commentId: AggregateID;
  readonly replyTo: AggregateID;
  readonly postId: AggregateID;
  readonly type: ReactType;
  readonly isUnReact: boolean;

  constructor(props: CommandProps<ReactCommentCommand>) {
    super(props);
    this.commentId = props.commentId;
    this.replyTo = props.replyTo;
    this.postId = props.postId;
    this.type = props.type;
    this.isUnReact = props.isUnReact;
  }
}
