import { LoggerPort } from '@lib/shared/common/ports';
import { ObjectLiteral } from '@lib/shared/common/types';
import { EventBus } from '@nestjs/cqrs';
import { AggregateRoot, AggregateRootProps, Mapper } from '.';

export abstract class BaseRepository<
  Aggregate extends AggregateRoot<AggregateRootProps>,
  DbRecord extends ObjectLiteral
> {
  protected constructor(
    protected readonly mapper: Mapper<Aggregate, DbRecord>,
    protected readonly eventBus: EventBus,
    protected readonly logger: LoggerPort
  ) {}
}
