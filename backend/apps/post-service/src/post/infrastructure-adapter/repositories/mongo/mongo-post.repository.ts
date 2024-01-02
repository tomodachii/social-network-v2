import { PostEntity, PostRepository } from '@lib/post/domain';
import { PostDocument } from '@prisma/client/post-mongodb';
import { MongoPostMapper } from './mongo-post.mapper';
import { EventBus } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';
import { Option } from 'oxide.ts';
import { PrismaMongoPostService } from '@lib/post/data-access';
import { BaseRepository } from '@lib/shared/ddd-v2';

@Injectable()
export class MongoPostRepository
  extends BaseRepository<PostEntity, PostDocument>
  implements PostRepository
{
  constructor(
    protected readonly mapper: MongoPostMapper,
    protected readonly eventBus: EventBus,
    protected readonly prisma: PrismaMongoPostService,
    protected readonly logger: Logger
  ) {
    super(mapper, eventBus, logger);
  }
  async findPostById(id: string): Promise<Option<PostEntity>> {
    const postDocument = await this.prisma.postDocument.findUnique({
      where: { postId: id },
    });

    return Option.safe(() => this.mapper.toDomain(postDocument));
  }
  async createPost(post: PostEntity): Promise<boolean> {
    const postDocument = this.mapper.toPersistence(post);
    const result = await this.prisma.postDocument.create({
      data: {
        postId: postDocument.id,
        content: postDocument.content,
        mode: postDocument.mode,
        userId: postDocument.userId,
        attachments: postDocument.attachments.map((attachment) => ({
          id: attachment.id,
          description: attachment.description,
          extension: attachment.extension,
          size: attachment.size,
          type: attachment.type,
          createdAt: attachment.createdAt,
        })),
        comments: [],
        reacts: [],
        originalPostId: postDocument.originalPostId,
        createdAt: postDocument.createdAt,
        version: 0,
      },
    });
    return !!result;
  }

  async savePost(post: PostEntity): Promise<boolean> {
    const postDocument = this.mapper.toPersistence(post);
    const result = await this.prisma.postDocument.update({
      where: { postId: postDocument.id },
      data: {
        content: postDocument.content,
        mode: postDocument.mode,
        userId: postDocument.userId,
        attachments: postDocument.attachments.map((attachment) => ({
          id: attachment.id,
          description: attachment.description,
          extension: attachment.extension,
          size: attachment.size,
          type: attachment.type,
          createdAt: attachment.createdAt,
        })),
        comments: postDocument.comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          userId: comment.userId,
          attachments: comment.attachments.map((attachment) => ({
            id: attachment.id,
            description: attachment.description,
            extension: attachment.extension,
            size: attachment.size,
            type: attachment.type,
            createdAt: attachment.createdAt,
          })),
          replies: comment.replies.map((reply) => ({
            id: reply.id,
            content: reply.content,
            userId: reply.userId,
            attachments: reply.attachments.map((attachment) => ({
              id: attachment.id,
              description: attachment.description,
              extension: attachment.extension,
              size: attachment.size,
              type: attachment.type,
              createdAt: attachment.createdAt,
            })),
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt,
          })),
          reacts: comment.reacts.map((react) => ({
            userId: react.userId,
            type: react.type,
          })),
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })),
        reacts: postDocument.reacts.map((react) => ({
          userId: react.userId,
          type: react.type,
        })),
        originalPostId: postDocument.originalPostId,
        createdAt: postDocument.createdAt,
        version: postDocument.version,
      },
    });
    return !!result;
  }

  async deletePost(post: PostEntity): Promise<boolean> {
    const result = await this.prisma.postDocument.delete({
      where: { postId: post.id },
    });
    return !!result;
  }
}
