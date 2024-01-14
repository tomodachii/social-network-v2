import { LoggerPort } from '@lib/shared/common/ports';
import { EventBus } from '@nestjs/cqrs';
import { AggregateRoot, AggregateRootProps, Mapper } from '.';

export abstract class BaseRepository<
  Aggregate extends AggregateRoot<AggregateRootProps>,
  DbRecord extends object
> {
  protected constructor(
    protected readonly mapper: Mapper<Aggregate, DbRecord>,
    protected readonly eventBus: EventBus,
    protected readonly logger: LoggerPort
  ) {}
}
