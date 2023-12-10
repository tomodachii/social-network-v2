import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';
import { CreateAttachmentProps } from '@lib/post/domain';

export class UpdateCommentCommand extends Command {
  readonly commentId: AggregateID;
  readonly postId: AggregateID;
  readonly replyTo: AggregateID;
  readonly content: string;
  readonly attachments: CreateAttachmentProps[];

  constructor(props: CommandProps<UpdateCommentCommand>) {
    super(props);
    this.commentId = props.commentId;
    this.postId = props.postId;
    this.replyTo = props.replyTo;
    this.content = props.content;
    this.attachments = props.attachments;
  }
}
