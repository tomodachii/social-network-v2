import { PrismaMongoPostService } from '@lib/post/data-access';
import { UserReplica, UserReplicaRepository } from '@lib/post/replica-user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoUserReplicaRepository implements UserReplicaRepository {
  constructor(private readonly prisma: PrismaMongoPostService) {}
  async updateVersion(userId: string): Promise<void> {
    await this.prisma.userDocument.update({
      where: {
        userId,
      },
      data: {
        version: {
          increment: 1,
        },
      },
    });
  }

  async saveReplica(userReplica: Partial<UserReplica>): Promise<void> {
    await this.prisma.userDocument.upsert({
      where: {
        userId: userReplica.userId,
      },
      create: {
        userId: userReplica.userId,
        firstName: userReplica.firstName,
        lastName: userReplica.lastName,
        avatarFileId: null,
      },
      update: {
        ...userReplica,
        avatarFileId: null,
        version: {
          increment: 1,
        },
      },
    });
  }

  async updateAvatar(userReplica: Partial<UserReplica>): Promise<UserReplica> {
    await this.prisma.userDocument.update({
      where: {
        userId: userReplica.userId,
      },
      data: {
        avatarFileId: userReplica.avatarFileId,
        version: {
          increment: 1,
        },
      },
    });
    return await this.prisma.userDocument.findUnique({
      where: {
        userId: userReplica.userId,
      },
    });
  }
}
