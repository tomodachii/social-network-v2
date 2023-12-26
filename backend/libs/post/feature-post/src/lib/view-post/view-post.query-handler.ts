import { QueryBase } from '@lib/shared/ddd';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPostService } from '@lib/post/data-access';

export class ViewPostQuery extends QueryBase {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(ViewPostQuery)
export class ViewPostQueryHandler implements IQueryHandler<ViewPostQuery> {
  constructor(private readonly prisma: PrismaPostService) {}
  async execute(query: ViewPostQuery) {
    return await this.prisma.postRecord.findUnique({
      where: {
        id: query.id,
      },
      select: {
        content: true,
        mode: true,
        createdAt: true,
        updatedAt: true,
        id: true,
        _count: {
          select: {
            comments: true,
            reacts: true,
          },
        },
        version: false,
        comments: {
          skip: 0,
          take: 5,
          select: {
            content: true,
            createdAt: true,
            id: true,
            updatedAt: true,
            attachments: true,
            _count: {
              select: {
                reacts: true,
              },
            },
            user: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                avatarFileId: true,
              },
            },
          },
        },
        reacts: true,
        attachments: true,
        user: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatarFileId: true,
          },
        },
        originalPost: {
          include: {
            user: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                avatarFileId: true,
              },
            },
            attachments: true,
            _count: {
              select: {
                comments: true,
                reacts: true,
              },
            },
          },
        },
      },
    });
  }
}
