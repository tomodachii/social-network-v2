import { PrismaPostService } from '@lib/post/data-access';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveUserReplicaCommand } from './save-user-replica.command';
import { Err, Ok, Result } from 'oxide.ts';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';

@CommandHandler(SaveUserReplicaCommand)
export class SaveUserReplicaCommandHandler
  implements ICommandHandler<SaveUserReplicaCommand>
{
  constructor(private readonly prisma: PrismaPostService) {}

  async execute(
    command: SaveUserReplicaCommand
  ): Promise<Result<boolean, Error>> {
    const user = await this.prisma.userRecord.findUnique({
      where: {
        userId: command.userId,
      },
    });

    if (user && user.version !== command.version + 1) {
      // return Err(
      //   new Exception('Version mismatch', HttpStatus.UNPROCESSABLE_ENTITY)
      // );
      return Ok(false);
    }

    await this.prisma.userRecord.upsert({
      where: {
        userId: command.userId,
      },
      create: {
        userId: command.userId,
        firstName: command.firstName,
        lastName: command.lastName,
        avatarFileId: null,
      },
      update: {
        firstName: command.firstName,
        lastName: command.lastName,
        avatarFileId: null,
        version: {
          increment: 1,
        },
      },
    });

    return Ok(true);
  }
}
