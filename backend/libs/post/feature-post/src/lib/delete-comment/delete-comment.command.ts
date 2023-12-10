import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';

export class DeleteCommentCommand extends Command {
  readonly commentId: AggregateID;
  readonly postId: AggregateID;
  readonly replyTo: AggregateID;

  constructor(props: CommandProps<DeleteCommentCommand>) {
    super(props);
    this.commentId = props.commentId;
    this.postId = props.postId;
    this.replyTo = props.replyTo;
  }
}
