import { ValueObject, ValueObjectProperties } from './value-object';

export abstract class ID<T> extends ValueObject<T> {
  protected constructor(properties: ValueObjectProperties<T>) {
    super(properties);
  }

  public abstract override validate(properties: ValueObjectProperties<T>): void;
}
