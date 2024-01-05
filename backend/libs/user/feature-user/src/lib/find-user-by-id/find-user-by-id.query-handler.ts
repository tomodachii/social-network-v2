import { PrismaUserService } from '@lib/user/data-access';
import { Ok, Result } from 'oxide.ts';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery>
{
  constructor(private readonly prisma: PrismaUserService) {}

  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */
  async execute(query: FindUserByIdQuery): Promise<Result<unknown, Error>> {
    const user = await this.prisma.userRecord.findUnique({
      where: {
        id: query.userId,
      },
      include: {
        avatar: true,
        cover: true,
      },
    });

    return Ok(user);
  }
}
