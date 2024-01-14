import { Entity } from './entity.base';

export interface Mapper<
  DomainEntity extends Entity<unknown, unknown>,
  DbRecord
> {
  toPersistence(entity: DomainEntity): DbRecord;
  toDomain(record: DbRecord): DomainEntity;
}
