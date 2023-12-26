import {
  AttachmentRecord,
  CommentPersistent,
  CommentRecord,
  PostPrersistent,
  PostRecord,
  PrismaPostService,
  ReactRecord,
} from '@lib/post/data-access';
import { BaseRepository } from '@lib/shared/common/databases';
import { Injectable, Logger } from '@nestjs/common';
import { PostEntity, CommentEntity, PostRepository } from '@lib/post/domain';
import { EventBus } from '@nestjs/cqrs';
import { PostMapper } from '../../post.mapper';
import { Ok, Option, Result } from 'oxide.ts';
import { v4 } from 'uuid';

@Injectable()
export class MysqlPostRepository
  extends BaseRepository<PostEntity, PostRecord>
  implements PostRepository
{
  constructor(
    protected readonly mapper: PostMapper,
    protected readonly eventBus: EventBus,
    protected readonly prisma: PrismaPostService,
    protected readonly logger: Logger
  ) {
    super(mapper, eventBus, logger);
  }

  async findPostById(id: string): Promise<Option<PostEntity>> {
    const postRecord = (await this.prisma.postRecord.findUnique({
      where: { id: id },
      include: {
        comments: {
          include: {
            reacts: true,
            attachments: true,
            replies: true,
          },
        },
        reacts: true,
        attachments: true,
      },
    })) as PostPrersistent;
    // return Option.safe(() => this.mapper.toDomain(postRecord));
    const result = this.mapper.toDomain(postRecord);
    return Option.safe(() => result);
  }
  async createPost(post: PostEntity): Promise<boolean> {
    const postPersistent = this.mapper.toPersistence(post);
    const attachments = postPersistent['attachments'] as AttachmentRecord[];

    const result = await this.prisma.postRecord.create({
      data: {
        id: postPersistent.id,
        content: postPersistent.content,
        mode: postPersistent.mode,
        userId: postPersistent.userId,
        originalPostId: postPersistent.originalPostId,
        version: 0,
        attachments: {
          createMany: {
            data: [
              ...attachments.map((attachment) => ({
                id: attachment.id,
                description: attachment.description,
                name: attachment.name,
                size: attachment.size,
                type: attachment.type,
              })),
            ],
            skipDuplicates: true,
          },
        },
      },
      include: {
        attachments: true,
      },
    });
    return !!result;
  }
  async savePost(post: PostEntity): Promise<boolean> {
    const postPersistent = this.mapper.toPersistence(post);
    const attachments = postPersistent['attachments'] as AttachmentRecord[];
    const comments = postPersistent['comments'] as CommentPersistent[];
    const reacts = postPersistent['reacts'] as ReactRecord[];

    const result = await this.prisma.postRecord.update({
      where: { id: postPersistent.id },
      data: {
        content: postPersistent.content,
        mode: postPersistent.mode,
        version: postPersistent.version + 1,
        attachments: {
          upsert: attachments.map((attachment) => ({
            where: { id: attachment.id },
            create: {
              id: attachment.id,
              description: attachment.description,
              name: attachment.name,
              size: attachment.size,
              type: attachment.type,
            },
            update: {
              description: attachment.description,
              name: attachment.name,
              size: attachment.size,
              type: attachment.type,
            },
          })),
          deleteMany: {
            id: {
              notIn: attachments.map((attachment) => attachment.id),
            },
          },
        },
        comments: {
          upsert: comments.map((comment) => ({
            where: { id: comment.id },
            create: {
              id: comment.id,
              content: comment.content,
              userId: comment.userId,
              attachments: {
                create: comment.attachments.map((attachment) => ({
                  description: attachment.description,
                  name: attachment.name,
                  size: attachment.size,
                  type: attachment.type,
                })),
              },
            },
            update: {
              content: comment.content,
              attachments: {
                upsert: comment.attachments.map((attachment) => ({
                  where: { id: attachment.id },
                  create: {
                    id: attachment.id,
                    description: attachment.description,
                    name: attachment.name,
                    size: attachment.size,
                    type: attachment.type,
                  },
                  update: {
                    description: attachment.description,
                    name: attachment.name,
                    size: attachment.size,
                    type: attachment.type,
                  },
                })),
                deleteMany: {
                  id: {
                    notIn: comment.attachments.map(
                      (attachment) => attachment.id
                    ),
                  },
                },
              },
              replies: {
                upsert: comment.replies.map((reply) => ({
                  where: { id: reply.id },
                  create: {
                    id: reply.id,
                    content: reply.content,
                    userId: reply.userId,
                    attachments: {
                      create: reply.attachments.map((attachment) => ({
                        description: attachment.description,
                        name: attachment.name,
                        size: attachment.size,
                        type: attachment.type,
                      })),
                    },
                  },
                  update: {
                    content: reply.content,
                    attachments: {
                      upsert: reply.attachments.map((attachment) => ({
                        where: { id: attachment.id },
                        create: {
                          id: attachment.id,
                          description: attachment.description,
                          name: attachment.name,
                          size: attachment.size,
                          type: attachment.type,
                        },
                        update: {
                          description: attachment.description,
                          name: attachment.name,
                          size: attachment.size,
                          type: attachment.type,
                        },
                      })),
                      deleteMany: {
                        id: {
                          notIn: reply.attachments.map(
                            (attachment) => attachment.id
                          ),
                        },
                      },
                    },
                    reacts: {
                      deleteMany: {
                        userId: {
                          in: reply.reacts.map((react) => react.userId),
                        },
                        AND: {
                          type: {
                            notIn: reply.reacts.map((react) => react.type),
                          },
                        },
                      },
                      createMany: {
                        data: reply.reacts.map((react) => ({
                          id: v4(),
                          type: react.type,
                          userId: react.userId,
                          postId: null,
                        })),
                        skipDuplicates: true,
                      },
                    },
                  },
                })),
                deleteMany: {
                  id: {
                    notIn: comment.replies.map((reply) => reply.id),
                  },
                },
              },
              reacts: {
                deleteMany: {
                  userId: {
                    in: comment.reacts.map((react) => react.userId),
                  },
                  AND: {
                    type: {
                      notIn: comment.reacts.map((react) => react.type),
                    },
                  },
                },
                createMany: {
                  data: comment.reacts.map((react) => ({
                    id: v4(),
                    type: react.type,
                    userId: react.userId,
                    postId: null,
                  })),
                  skipDuplicates: true,
                },
              },
            },
          })),
          deleteMany: {
            id: {
              notIn: comments.map((comment) => comment.id),
            },
          },
        },
        reacts: {
          deleteMany: {
            userId: {
              in: reacts.map((react) => react.userId),
            },
            AND: {
              type: {
                notIn: reacts.map((react) => react.type),
              },
            },
          },
          createMany: {
            data: reacts.map((react) => ({
              id: v4(),
              type: react.type,
              userId: react.userId,
              commentId: null,
            })),
            skipDuplicates: true,
          },
        },
      },
      include: {
        attachments: true,
        comments: {
          include: {
            attachments: true,
            reacts: true,
            replies: {
              include: {
                attachments: true,
                reacts: true,
              },
            },
          },
        },
      },
    });
    return !!result;
  }
  async deletePost(post: PostEntity): Promise<boolean> {
    const result = await this.prisma.postRecord.delete({
      where: { id: post.id },
    });
    return !!result;
  }
  findCommentById(id: string): Promise<CommentEntity> {
    throw new Error('Method not implemented.');
  }
  async checkExistAttachmentsByIds(ids: string[]): Promise<boolean> {
    const result = await this.prisma.attachmentRecord.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return result.length > 0;
  }
}
