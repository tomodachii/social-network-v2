import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAvatarUserReplicaCommand } from './update-avatar-user-replica.command';
import { PrismaMongoPostService } from '@lib/post/data-access';
import { Err, Ok, Result } from 'oxide.ts';
import { Exception } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';

@CommandHandler(UpdateAvatarUserReplicaCommand)
export class UpdateAvatarUserReplicaCommandHandler
  implements ICommandHandler<UpdateAvatarUserReplicaCommand>
{
  constructor(private readonly prisma: PrismaMongoPostService) {}
  async execute(
    command: UpdateAvatarUserReplicaCommand
  ): Promise<Result<boolean, Error>> {
    // const user = await this.prisma.userRecord.findUnique({
    //   where: {
    //     userId: command.userId,
    //   },
    // });

    // if (user && user.version !== command.version + 1) {
    //   return Err(
    //     new Exception('Version mismatch', HttpStatus.UNPROCESSABLE_ENTITY)
    //   );
    // }

    await this.prisma.userDocument.update({
      where: {
        userId: command.userId,
      },
      data: {
        avatarFileId: command.avatarFileId,
        version: {
          increment: 1,
        },
      },
    });

    return Ok(true);
  }
}
