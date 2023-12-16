import { AggregateID, AggregateRoot } from '@lib/shared/ddd-v2';
import { Guard } from '@lib/shared/common/utils';
import { ArgumentNotProvidedException } from '@lib/shared/common/exceptions';
import { v4 } from 'uuid';
import { HttpStatus } from '@lib/shared/common/api';
import { ReactProps, ReactVO } from './value-objects';
import {
  AttachmentEntity,
  CommentEntity,
  CreateAttachmentProps,
  CreateCommentProps,
} from './entities';
import { PostMode } from './post.type';

export interface PostProps {
  content: string;
  reacts: ReactVO[];
  comments: CommentEntity[];
  userId: AggregateID;
  attachments: AttachmentEntity[];
  mode: PostMode;
  originalPost?: PostEntity;
}

export interface CreatePostProps {
  content: string;
  userId: AggregateID;
  attachments: AttachmentEntity[];
  mode: PostMode;
  originalPost?: PostEntity;
}

export class PostEntity extends AggregateRoot<PostProps> {
  static create(create: CreatePostProps): PostEntity {
    const id = v4();
    const props: PostProps = {
      ...create,
      reacts: [],
      comments: [],
    };
    return new PostEntity({ id, props });
  }

  get content(): string {
    return this.props.content;
  }

  get reacts(): ReactVO[] {
    return this.props.reacts;
  }

  get userId(): AggregateID {
    return this.props.userId;
  }

  get attachments(): AttachmentEntity[] {
    return this.getPropsCopy().attachments;
  }

  get comments(): CommentEntity[] {
    return this.getPropsCopy().comments;
  }

  get mode(): PostMode {
    return this.props.mode;
  }

  set content(content: string) {
    this.props.content = content;
  }

  set mode(mode: PostMode) {
    this.props.mode = mode;
  }

  addComment(createCommentProp: CreateCommentProps): string {
    const comment = CommentEntity.create(createCommentProp);
    this.props.comments.push(comment);
    return comment.id;
  }

  updateComment(
    commentId: AggregateID,
    updateCommentProp: Partial<CreateCommentProps>
  ): void {
    const comment = this.props.comments.find((c) => c.id === commentId);
    if (!comment) {
      throw new ArgumentNotProvidedException(
        'Comment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    comment.content = updateCommentProp.content || comment.content;
    for (const attachment of comment.attachments) {
      comment.removeAttachment(attachment.id);
    }
    for (const attachment of updateCommentProp.attachments!) {
      comment.addAttachment(attachment);
    }
  }

  getComment(commentId: AggregateID): CommentEntity {
    const comment = this.props.comments.find((c) => c.id === commentId);
    if (!comment) {
      throw new ArgumentNotProvidedException(
        'Comment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    return comment;
  }

  removeComment(commentId: AggregateID): void {
    const commentIndex = this.props.comments.findIndex(
      (c) => c.id === commentId
    );
    if (commentIndex === -1) {
      throw new ArgumentNotProvidedException(
        'Comment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    this.props.comments.splice(commentIndex, 1);
  }

  getReplyToComment(
    commentId: AggregateID,
    replyId: AggregateID
  ): CommentEntity {
    const comment = this.getComment(commentId);
    if (!comment) {
      throw new ArgumentNotProvidedException(
        'Comment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    const reply = comment.replies.find((r) => r.id === replyId);
    if (!reply) {
      throw new ArgumentNotProvidedException(
        'Reply does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    return reply;
  }

  addReplyToComment(
    commentId: AggregateID,
    createReplyProp: CreateCommentProps
  ): AggregateID {
    const comment = this.getComment(commentId);
    if (!comment) {
      throw new ArgumentNotProvidedException(
        'Comment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    return comment.addReply(createReplyProp);
  }

  updateReplyToComment(
    commentId: AggregateID,
    replyId: AggregateID,
    updateReplyProp: Partial<CreateCommentProps>
  ): void {
    const comment = this.getComment(commentId);
    if (!comment) {
      throw new ArgumentNotProvidedException(
        'Comment does not exist ' + commentId,
        HttpStatus.BAD_REQUEST
      );
    }
    comment.updateReply(replyId, updateReplyProp);
  }

  removeReplyToComment(commentId: AggregateID, replyId: AggregateID): void {
    const comment = this.getComment(commentId);
    if (!comment) {
      throw new ArgumentNotProvidedException(
        'Comment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    comment.removeReply(replyId);
  }

  addAttachment(createAttachment: CreateAttachmentProps): void {
    const attachment = AttachmentEntity.create(createAttachment);
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

  addReactOfComment(
    commentId: AggregateID,
    replyTo: AggregateID,
    reactProp: ReactProps
  ): void {
    let comment: CommentEntity;
    if (replyTo === this.id) {
      comment = this.getComment(commentId);
    } else {
      comment = this.getReplyToComment(replyTo, commentId);
    }
    if (!comment) {
      throw new ArgumentNotProvidedException(
        'Comment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    const react = new ReactVO(reactProp);
    comment.addReact(react);
  }

  removeReactOfComment(commentId: AggregateID, replyTo: AggregateID): void {
    let comment: CommentEntity;
    if (replyTo === this.id) {
      comment = this.getComment(commentId);
    } else {
      comment = this.getReplyToComment(replyTo, commentId);
    }
    if (!comment) {
      throw new ArgumentNotProvidedException(
        'Comment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    comment.removeReact(commentId);
  }

  addReact(reactProp: ReactProps): void {
    const react = new ReactVO(reactProp);
    const reactIndex = this.props.reacts.findIndex(
      (react) => react.userId === reactProp.userId
    );
    if (reactIndex !== -1) {
      this.props.reacts.splice(reactIndex, 1, react);
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

  public validate(): void {
    if (Guard.isEmpty(this.props.userId)) {
      throw new ArgumentNotProvidedException(
        'Post must belong to one user',
        HttpStatus.BAD_REQUEST
      );
    }
    if (
      !Guard.isEmpty(this.props.originalPost) &&
      !Guard.isEmpty(this.props.attachments)
    ) {
      throw new ArgumentNotProvidedException(
        'Shared post must not have attachments',
        HttpStatus.BAD_REQUEST
      );
    }
    if (
      Guard.isEmpty(this.props.attachments) &&
      Guard.isEmpty(this.props.content)
    ) {
      throw new ArgumentNotProvidedException(
        'Post must have content or attachments',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
