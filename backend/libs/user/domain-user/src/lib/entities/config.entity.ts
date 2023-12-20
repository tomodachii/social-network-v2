import { AggregateID, Entity } from '@lib/shared/ddd-v2';

interface ConfigProps {}

export class ConfigEntity extends Entity<ConfigProps, AggregateID> {
  public validate(): void {}
}
