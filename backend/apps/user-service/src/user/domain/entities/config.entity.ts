import { Entity } from '@lib/shared/ddd';

interface ConfigProps {}

export class ConfigEntity extends Entity<ConfigProps> {
  protected _id: string;
  public validate(): void {}
}
