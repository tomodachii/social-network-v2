import { AggregateID, Command, CommandProps } from '@lib/shared/ddd-v2';
import { CreateAttachmentProps, PostMode } from '@lib/post/domain';

export class CreatePostCommand extends Command {
  readonly content: string;
  readonly originalPostId: AggregateID;
  readonly attachments: CreateAttachmentProps[];
  readonly mode: PostMode;

  constructor(props: CommandProps<CreatePostCommand>) {
    super(props);
    this.content = props.content;
    this.originalPostId = props.originalPostId;
    this.attachments = props.attachments;
    this.mode = props.mode;
  }
}
