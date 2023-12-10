import { Entity } from './entity.base';

export interface Mapper<
  DomainEntity extends Entity<any, any>,
  DbRecord,
  Response = any
> {
  toPersistence(entity: DomainEntity): DbRecord;
  toDomain(record: any): DomainEntity;
  toResponse(entity: DomainEntity): Response;
}
