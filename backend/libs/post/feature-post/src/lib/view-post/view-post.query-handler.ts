import { QueryBase } from '@lib/shared/ddd-v2';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaMongoPostService } from '@lib/post/data-access';
import { ObjectLiteral } from '@lib/shared/common/types';

export class ViewPostQuery extends QueryBase {
  constructor(public readonly id: string) {
    super();
  }
}
// select: {
//         postId: true,
//         content: true,
//         mode: true,
//         createdAt: true,
//         updatedAt: true,
//         user: {
//           select: {
//             userId: true,
//             firstName: true,
//             lastName: true,
//             avatarFileId: true,
//           },
//         },
//         comments: {
//           select: {
//             id: true,
//             content: true,
//             createdAt: true,
//             updatedAt: true,
//             attachments: true,
//             reacts: true,
//             userId: true,
//           },
//           include: true,
//         },
//       },
@QueryHandler(ViewPostQuery)
export class ViewPostQueryHandler implements IQueryHandler<ViewPostQuery> {
  constructor(private readonly prisma: PrismaMongoPostService) {}
  async execute(query: ViewPostQuery): Promise<ObjectLiteral> {
    return (
      (await this.prisma.postDocument.findUnique({
        where: {
          postId: query.id,
        },
        select: {
          postId: true,
          content: true,
          mode: true,
          createdAt: true,
          updatedAt: true,
          originalPost: {
            select: {
              attachments: true,
              content: true,
              createdAt: true,
              mode: true,
              postId: true,
              user: {
                select: {
                  userId: true,
                  firstName: true,
                  lastName: true,
                  avatarFileId: true,
                },
              },
              comments: {
                select: {
                  id: true,
                },
              },
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
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              reacts: true,
              userId: true,
            },
          },
        },
      })) || {}
    );
  }
}

// return await this.prisma.postRecord.findUnique({
//   where: {
//     id: query.id,
//   },
//   select: {
//     content: true,
//     mode: true,
//     createdAt: true,
//     updatedAt: true,
//     id: true,
//     _count: {
//       select: {
//         comments: true,
//         reacts: true,
//       },
//     },
//     version: false,
//     comments: {
//       skip: 0,
//       take: 5,
//       select: {
//         content: true,
//         createdAt: true,
//         id: true,
//         updatedAt: true,
//         attachments: true,
//         _count: {
//           select: {
//             reacts: true,
//           },
//         },
//         user: {
//           select: {
//             userId: true,
//             firstName: true,
//             lastName: true,
//             avatarFileId: true,
//           },
//         },
//       },
//     },
//     reacts: true,
//     attachments: true,
//     user: {
//       select: {
//         userId: true,
//         firstName: true,
//         lastName: true,
//         avatarFileId: true,
//       },
//     },
//     originalPost: {
//       include: {
//         user: {
//           select: {
//             userId: true,
//             firstName: true,
//             lastName: true,
//             avatarFileId: true,
//           },
//         },
//         attachments: true,
//         _count: {
//           select: {
//             comments: true,
//             reacts: true,
//           },
//         },
//       },
//     },
//   },
// });
