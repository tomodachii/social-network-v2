import { Mapper } from '@lib/shared/ddd-v2';
import {
  AddressVO,
  BioImageType,
  BioImageEntity,
  ConfigEntity,
  Gender,
  UserEntity,
} from '@lib/user/domain';
import { UserPersistent, UserRecord } from '@lib/user/data-access';

export class MysqlUserMapper implements Mapper<UserEntity, UserRecord> {
  toPersistence(entity: UserEntity): UserPersistent {
    const copy = entity.getPropsCopy();
    const record: UserPersistent = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      postalCode: copy.address?.postalCode,
      city: copy.address?.city,
      firstName: copy.firstName,
      lastName: copy.lastName,
      gender: copy.gender,
      bio: copy.bio,
      birthDay: copy.birthDay,
      configId: copy.config?.id,
      avatarId: copy.avatar?.id,
      coverId: copy.cover?.id,
      avatar: copy.avatar?.getPropsCopy(),
      cover: copy.cover?.getPropsCopy(),
      version: 0,
    };
    return record;
  }
  toDomain(record: UserPersistent): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        firstName: record.firstName,
        lastName: record.lastName,
        gender: record.gender as Gender,
        bio: record.bio,
        version: record.version,
        birthDay: new Date(record.birthDay),
        address:
          record.postalCode &&
          record.city &&
          new AddressVO({
            postalCode: record.postalCode,
            city: record.city,
          }),
        config:
          record.configId &&
          new ConfigEntity({
            id: record.configId,
            props: {},
          }),
        avatar:
          record.avatar &&
          new BioImageEntity({
            id: record.avatarId,
            props: {
              extension: record.avatar.extension,
              size: record.avatar.size,
              type: record.avatar.type as BioImageType,
            },
          }),
        cover:
          record.cover &&
          new BioImageEntity({
            id: record.coverId,
            props: {
              extension: record.cover.extension,
              size: record.cover.size,
              type: record.cover.type as BioImageType,
            },
          }),
      },
    });
    return entity;
  }
}
