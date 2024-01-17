import { Mapper } from '@lib/shared/ddd-v2';
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
  // CommentPersistent,
  // PostPersistent,
  React,
  Attachment,
  PostDocument,
  Comment,
} from '@lib/post/data-access';

export class MongoPostMapper implements Mapper<PostEntity, PostDocument> {
  toDomain(record: PostDocument): PostEntity {
    const result = new PostEntity({
      id: record.postId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        version: record.version,
        content: record.content,
        mode: record.mode as PostMode,
        userId: record.userId,
        attachments:
          record.attachments?.map(MongoPostMapper.initAttachmentEntity) ?? [],
        comments: record.comments?.map(MongoPostMapper.initCommentEntity) ?? [],
        reacts: record.reacts?.map(MongoPostMapper.initReactVO) ?? [],
      },
    });
    return result;
  }

  private static initReactVO(react: React): ReactVO {
    return new ReactVO({
      type: react.type as ReactType,
      userId: react.userId,
    });
  }

  private static initAttachmentEntity(
    attachment: Attachment
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

  private static initCommentEntity(comment: Comment): CommentEntity {
    const result = new CommentEntity({
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.createdAt,
      props: {
        content: comment.content,
        userId: comment.userId,
        attachments:
          comment.attachments?.map(MongoPostMapper.initAttachmentEntity) ?? [],
        replies: comment.replies?.map(MongoPostMapper.initCommentEntity) ?? [],
        reacts: comment.reacts?.map(MongoPostMapper.initReactVO) ?? [],
      },
    });
    return result;
  }

  toPersistence(domain: PostEntity): PostDocument {
    const postCopy = domain.getPropsCopy();
    return {
      id: postCopy.id,
      postId: postCopy.id,
      content: postCopy.content,
      createdAt: postCopy.createdAt,
      updatedAt: postCopy.updatedAt,
      mode: postCopy.mode,
      originalPostId: postCopy.originalPost?.id,
      version: 0,
      attachments: postCopy.attachments.map(
        MongoPostMapper.initAttachmentRecord
      ),
      comments: postCopy.comments.map(MongoPostMapper.initComment),
      reacts: postCopy.reacts.map(MongoPostMapper.initReactRecord),
      userId: postCopy.userId,
    };
  }

  private static initAttachmentRecord(
    attachment: AttachmentEntity
  ): Attachment {
    const attachmentCopy = attachment.getPropsCopy();
    return {
      id: attachmentCopy.id,
      createdAt: attachmentCopy.createdAt,
      extension: attachmentCopy.extension,
      description: attachmentCopy.description,
      size: attachmentCopy.size,
      type: attachmentCopy.type,
    };
  }

  private static initReactRecord(react: ReactVO): React {
    return {
      type: react.type,
      userId: react.userId,
    };
  }

  private static initComment(comment: CommentEntity): Comment {
    const commentCopy = comment.getPropsCopy();
    return {
      id: commentCopy.id,
      createdAt: commentCopy.createdAt,
      updatedAt: commentCopy.updatedAt,
      content: commentCopy.content,
      userId: commentCopy.userId,
      attachments: commentCopy.attachments.map(
        MongoPostMapper.initAttachmentRecord
      ),
      reacts: commentCopy.reacts.map(MongoPostMapper.initReactRecord),
      replies: commentCopy.replies.map(MongoPostMapper.initComment),
    };
  }
}
