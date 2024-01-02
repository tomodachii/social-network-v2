import { BaseRepository } from '@lib/shared/ddd-v2';
import { BioImageType, UserEntity, UserRepository } from '@lib/user/domain';
import { PrismaUserService, UserRecord } from '@lib/user/data-access';
import { EventBus } from '@nestjs/cqrs';
import { MysqlUserMapper } from './mysql-user.mapper';
import { Logger, Injectable } from '@nestjs/common';
import { None, Option, Some } from 'oxide.ts';

@Injectable()
export class MysqlUserRepository
  extends BaseRepository<UserEntity, UserRecord>
  implements UserRepository
{
  constructor(
    protected readonly mapper: MysqlUserMapper,
    protected readonly eventBus: EventBus,
    protected readonly prisma: PrismaUserService,
    protected readonly logger: Logger
  ) {
    super(mapper, eventBus, logger);
  }

  async insertOne(user: UserEntity): Promise<boolean> {
    const record = this.mapper.toPersistence(user);
    const createUser = this.prisma.userRecord.create({
      data: {
        firstName: record.firstName,
        lastName: record.lastName,
        gender: record.gender,
        id: record.id,
        birthDay: record.birthDay,
      },
    });
    return (await createUser) !== null;
  }

  async findById(userId: string): Promise<Option<UserEntity>> {
    const record = await this.prisma.userRecord.findUnique({
      where: { id: userId },
      include: {
        avatar: true,
        cover: true,
      },
    });
    return record ? Some(this.mapper.toDomain(record)) : None;
  }

  deleteBioImage(userRecord: UserRecord) {
    return this.prisma.bioImageRecord.deleteMany({
      where: {
        OR: [
          {
            avatarUser: {
              id: userRecord.id,
            },
            AND: {
              type: BioImageType.AVATAR,
              AND: {
                id: {
                  not: userRecord.avatarId,
                },
              },
            },
          },
          {
            coverUser: {
              id: userRecord.id,
            },
            AND: {
              type: BioImageType.COVER,
              AND: {
                id: {
                  not: userRecord.coverId,
                },
              },
            },
          },
        ],
      },
    });
  }

  async updateUserProfile(user: UserEntity): Promise<boolean> {
    const record = this.mapper.toPersistence(user);
    const updatedUser = await this.prisma.userRecord.update({
      where: { id: record.id },
      data: {
        firstName: record.firstName,
        lastName: record.lastName,
        gender: record.gender,
        bio: record.bio,
        birthDay: record.birthDay,
        postalCode: record.postalCode,
        city: record.city,
        version: {
          increment: 1,
        },
      },
    });
    return updatedUser !== null;
  }

  async saveUser(user: UserEntity): Promise<Option<UserEntity>> {
    const userRecord = this.mapper.toPersistence(user);
    await this.prisma.$transaction([
      this.deleteBioImage(userRecord),
      this.prisma.userRecord.update({
        where: {
          id: userRecord.id,
        },
        data: {
          bio: userRecord.bio,
          firstName: userRecord.firstName,
          lastName: userRecord.lastName,
          birthDay: userRecord.birthDay,
          gender: userRecord.gender,
          postalCode: userRecord.postalCode,
          city: userRecord.city,
          version: {
            increment: 1,
          },
          avatar: {
            connectOrCreate: userRecord.avatar.id && {
              where: {
                id: userRecord.avatar.id,
              },
              create: {
                id: userRecord.avatar.id,
                size: userRecord.avatar.size,
                extension: userRecord.avatar.extension,
                type: userRecord.avatar.type,
                createdAt: userRecord.avatar.createdAt,
                updatedAt: userRecord.avatar.updatedAt,
              },
            },
          },
          cover: {
            connectOrCreate: userRecord.cover?.id && {
              where: {
                id: userRecord.cover?.id,
              },
              create: {
                extension: userRecord.cover?.extension,
                size: userRecord.cover?.size,
                type: userRecord.cover?.type,
                id: userRecord.cover?.id,
                createdAt: userRecord.cover?.createdAt,
                updatedAt: userRecord.cover?.updatedAt,
              },
            },
          },
        },
      }),
    ]);

    return await this.findById(userRecord.id);
  }
}
