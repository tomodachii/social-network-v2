import { AggregateID, Mapper } from '@lib/shared/ddd-v2';
import {
  AttachmentEntity,
  AttachmentType,
  CommentEntity,
  PostEntity,
  PostMode,
  ReactType,
  ReactVO,
} from '@lib/post/domain';
import {
  CommentPersistent,
  PostPersistent,
  ReactRecord,
  AttachmentRecord,
  PostRecord,
  CommentRecord,
} from '@lib/post/data-access';

export class MysqlPostMapper implements Mapper<PostEntity, PostRecord> {
  toDomain(record: PostPersistent): PostEntity {
    const result = new PostEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        content: record.content,
        version: record.version,
        mode: record.mode as PostMode,
        userId: record.userId,
        attachments:
          record.attachments?.map(MysqlPostMapper.initAttachmentEntity) ?? [],
        comments: record.comments?.map(MysqlPostMapper.initCommentEntity) ?? [],
        reacts: record.reacts?.map(MysqlPostMapper.initReactVO) ?? [],
      },
    });
    return result;
  }

  private static initReactVO(react: ReactRecord): ReactVO {
    return new ReactVO({
      type: react.type as ReactType,
      userId: react.userId,
    });
  }

  private static initAttachmentEntity(
    attachment: AttachmentRecord
  ): AttachmentEntity {
    return new AttachmentEntity({
      id: attachment.id,
      createdAt: attachment.createdAt,
      updatedAt: attachment.createdAt,
      props: {
        type: attachment.type as AttachmentType,
        extension: attachment.extension,
        description: attachment.description,
        size: attachment.size,
      },
    });
  }

  private static initCommentEntity(comment: CommentPersistent): CommentEntity {
    const result = new CommentEntity({
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.createdAt,
      props: {
        content: comment.content,
        userId: comment.userId,
        attachments:
          comment.attachments?.map(MysqlPostMapper.initAttachmentEntity) ?? [],
        replies: comment.replies?.map(MysqlPostMapper.initCommentEntity) ?? [],
        reacts: comment.reacts?.map(MysqlPostMapper.initReactVO) ?? [],
      },
    });
    return result;
  }

  toPersistence(domain: PostEntity): PostRecord {
    const postCopy = domain.getPropsCopy();
    const record = {
      id: postCopy.id,
      content: postCopy.content,
      createdAt: postCopy.createdAt,
      updatedAt: postCopy.updatedAt,
      mode: postCopy.mode,
      originalPostId: postCopy.originalPost?.id,
      version: 0,
      attachments: postCopy.attachments.map((attachment) =>
        this.initAttachmentRecord(attachment, postCopy.id)
      ),
      comments: postCopy.comments.map((comment) =>
        this.initCommentRecord(comment, postCopy.id)
      ),
      reacts: postCopy.reacts.map((react) =>
        this.initReactRecord(react, postCopy.id)
      ),
      userId: postCopy.userId,
    };
    return record;
  }

  private initAttachmentRecord(
    attachment: AttachmentEntity,
    ownnerId: AggregateID
  ): Partial<AttachmentRecord> {
    const attachmentCopy = attachment.getPropsCopy();
    return {
      id: attachmentCopy.id,
      createdAt: attachmentCopy.createdAt,
      extension: attachmentCopy.extension,
      description: attachmentCopy.description,
      size: attachmentCopy.size,
      type: attachmentCopy.type,
      postId: ownnerId,
      commentId: ownnerId,
    };
  }

  private initReactRecord(
    react: ReactVO,
    ownnerId: AggregateID
  ): Partial<ReactRecord> {
    return {
      type: react.type,
      userId: react.userId,
      postId: ownnerId,
      commentId: ownnerId,
    };
  }

  private initCommentRecord(
    comment: CommentEntity,
    ownnerId: AggregateID
  ): Partial<CommentRecord> {
    const commentCopy = comment.getPropsCopy();
    const record = {
      id: commentCopy.id,
      createdAt: commentCopy.createdAt,
      updatedAt: commentCopy.updatedAt,
      content: commentCopy.content,
      userId: commentCopy.userId,
      replyTo: ownnerId,
      attachments: commentCopy.attachments.map((attachment) =>
        this.initAttachmentRecord(attachment, commentCopy.id)
      ),
      reacts: commentCopy.reacts.map((react) =>
        this.initReactRecord(react, commentCopy.id)
      ),
      replies: commentCopy.replies.map((comment) =>
        this.initCommentRecord(comment, commentCopy.id)
      ),
    };
    return record;
  }
}
