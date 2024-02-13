import { getInvalidValueMessage } from '../utils/domain.utils';
import { ArgumentInvalidException } from '@lib/shared/common/exceptions';
import { ValueObject, ValueObjectProperties } from './value-object';
import { HttpStatus } from '@lib/shared/common/api';
import { isDate } from '@lib/shared/common/utils';

export class DateVO extends ValueObject<Date> {
  public constructor(properties: ValueObjectProperties<Date>) {
    super(properties);
  }

  public static fromDateString(dateStr: string) {
    return new DateVO({ value: new Date(dateStr) });
  }

  public validate(properties: ValueObjectProperties<Date>) {
    if (!isDate(properties.value)) {
      throw new ArgumentInvalidException(
        getInvalidValueMessage(this),
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
