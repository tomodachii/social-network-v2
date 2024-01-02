import { AggregateID, Entity } from '@lib/shared/ddd-v2';
import { Guard } from '@lib/shared/common/utils';
import { ArgumentNotProvidedException } from '@lib/shared/common/exceptions';
import { v4 } from 'uuid';
import { HttpStatus } from '@lib/shared/common/api';
import { ReactVO } from '../value-objects/react.vo';
import { AttachmentEntity, CreateAttachmentProps } from './attachment.entity';
import { Nullable } from '@lib/shared/common/types';

export interface CommentProps {
  content: string;
  reacts: ReactVO[];
  replies: CommentEntity[];
  userId: AggregateID;
  attachments: AttachmentEntity[];
}

export interface CreateCommentProps {
  content: string;
  userId: AggregateID;
  attachments: CreateAttachmentProps[];
}

export class CommentEntity extends Entity<CommentProps, AggregateID> {
  static create(create: CreateCommentProps): CommentEntity {
    const id = v4();
    const props: CommentProps = {
      ...create,
      attachments: create.attachments.map((createAttachment) =>
        AttachmentEntity.create(createAttachment)
      ),
      reacts: [],
      replies: [],
    };
    return new CommentEntity({ id, props });
  }

  get content(): string {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
  }

  get reacts(): ReactVO[] {
    return this.props.reacts;
  }

  get userId(): AggregateID {
    return this.props.userId;
  }

  get attachments(): AttachmentEntity[] {
    return this.props.attachments;
  }

  get replies(): CommentEntity[] {
    return this.props.replies;
  }

  addReact(react: ReactVO): void {
    const reactIndex = this.props.reacts.findIndex(
      (r) => r.userId === react.userId
    );
    if (reactIndex !== -1) {
      this.props.reacts[reactIndex] = react;
    } else {
      this.props.reacts.push(react);
    }
  }

  removeReact(userId: AggregateID): void {
    const reactIndex = this.props.reacts.findIndex((r) => r.userId === userId);
    if (reactIndex === -1) {
      throw new ArgumentNotProvidedException(
        'User did not react',
        HttpStatus.BAD_REQUEST
      );
    }
    this.props.reacts.splice(reactIndex, 1);
  }

  addReply(createReplyProps: CreateCommentProps): AggregateID {
    const reply = CommentEntity.create(createReplyProps);
    this.props.replies.push(reply);
    return reply.id;
  }

  updateReply(
    replyId: AggregateID,
    updateReplyProps: CreateCommentProps
  ): void {
    const reply = this.getReply(replyId);
    if (!reply) {
      throw new ArgumentNotProvidedException(
        'Reply does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    reply.content = updateReplyProps.content;
  }

  removeReply(replyId: AggregateID): void {
    const replyIndex = this.props.replies.findIndex((r) => r.id === replyId);
    if (replyIndex === -1) {
      throw new ArgumentNotProvidedException(
        'Reply does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    this.props.replies.splice(replyIndex, 1);
  }

  getReply(replyId: AggregateID): Nullable<CommentEntity> {
    return this.props.replies.find((r) => r.id === replyId);
  }

  addAttachment(createAttachment: CreateAttachmentProps): void {
    const attachment = AttachmentEntity.create({
      description: createAttachment.description,
      extension: createAttachment.extension,
      size: createAttachment.size,
      type: createAttachment.type,
      id: createAttachment.id,
    });
    if (!this.props.attachments.find((a) => a.id === attachment.id)) {
      this.props.attachments.push(attachment);
    }
  }

  removeAttachment(attachmentId: AggregateID): void {
    const attachmentIndex = this.props.attachments.findIndex(
      (a) => a.id === attachmentId
    );
    if (attachmentIndex === -1) {
      throw new ArgumentNotProvidedException(
        'Attachment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    this.props.attachments.splice(attachmentIndex, 1);
  }

  public validate(): void {
    if (
      Guard.isEmpty(this.props.attachments) &&
      Guard.isEmpty(this.props.content)
    ) {
      throw new ArgumentNotProvidedException(
        'Comment must have content or attachments',
        HttpStatus.BAD_REQUEST
      );
    }
    if (Guard.isEmpty(this.props.userId)) {
      throw new ArgumentNotProvidedException(
        'Comment must belong to one user',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
