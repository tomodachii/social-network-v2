import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';
import { CreateAttachmentProps, PostMode } from '@lib/post/domain';

export class UpdatePostCommand extends Command {
  readonly postId: AggregateID;
  readonly content: string;
  readonly attachments: CreateAttachmentProps[];
  readonly mode: PostMode;

  constructor(props: CommandProps<UpdatePostCommand>) {
    super(props);
    this.postId = props.postId;
    this.content = props.content;
    this.attachments = props.attachments;
    this.mode = props.mode;
  }
}
