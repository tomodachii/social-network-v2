import { ObjectLiteral } from '@lib/shared/common/types';
import { Entity } from './entity.base';

export interface Mapper<
  DomainEntity extends Entity<unknown, unknown>,
  DbRecord
> {
  toPersistence(entity: DomainEntity): DbRecord;
  toDomain(record: ObjectLiteral): DomainEntity;
}
