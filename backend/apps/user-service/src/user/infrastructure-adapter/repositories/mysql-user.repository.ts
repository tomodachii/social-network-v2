import { BaseRepository } from '@lib/shared/common/databases';
import { BioImageType, UserEntity, UserRepository } from '@lib/user/domain';
import { PrismaUserService, UserRecord } from '@lib/user/data-access';
import { EventBus } from '@nestjs/cqrs';
import { MysqlUserMapper } from './mysql-user.mapper';
import { Logger, Injectable } from '@nestjs/common';
import { None, Option, Some } from 'oxide.ts';

@Injectable()
export class MysqlUserRepository
  extends BaseRepository<any, UserRecord>
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

  async updateAvatar(user: UserEntity): Promise<boolean> {
    const userRecord = this.mapper.toPersistence(user);
    const avatarRecord = userRecord.avatar;
    const [deleteAvatar, createAvatar] = await this.prisma.$transaction([
      this.deleteBioImage(user, BioImageType.AVATAR),
      this.prisma.bioImageRecord.create({
        data: {
          extension: avatarRecord.extension,
          size: avatarRecord.size,
          type: avatarRecord.type,
          id: avatarRecord.id,
          createdAt: avatarRecord.createdAt,
          updatedAt: avatarRecord.updatedAt,
          avatarUser: {
            connect: {
              id: userRecord.id,
            },
          },
        },
      }),
    ]);
    return createAvatar !== null;
  }

  async updateCover(user: UserEntity): Promise<boolean> {
    const userRecord = this.mapper.toPersistence(user);
    const coverRecord = userRecord.cover;
    const [deleteCover, createCover] = await this.prisma.$transaction([
      this.deleteBioImage(user, BioImageType.COVER),
      this.prisma.bioImageRecord.create({
        data: {
          extension: coverRecord.extension,
          size: coverRecord.size,
          type: coverRecord.type,
          id: coverRecord.id,
          createdAt: coverRecord.createdAt,
          updatedAt: coverRecord.updatedAt,
          coverUser: {
            connect: {
              id: userRecord.id,
            },
          },
        },
      }),
    ]);
    return createCover !== null;
  }

  deleteBioImage(user: UserEntity, type: BioImageType) {
    const userRecord = this.mapper.toPersistence(user);
    return this.prisma.bioImageRecord.deleteMany({
      where: {
        OR: [
          {
            avatarUser: {
              id: userRecord.id,
            },
          },
          {
            coverUser: {
              id: userRecord.id,
            },
          },
        ],
        type: type,
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
}