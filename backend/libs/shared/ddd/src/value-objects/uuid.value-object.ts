import { ID } from './id.value-object';
// import { NullAbleValue } from '../decorators';
import { ValueObjectProperties } from './value-object';
import { getInvalidValueMessage } from '../utils/domain.utils';
import { isUUID, generateUUID } from '@lib/shared/common/utils';
import { ArgumentInvalidException } from '@lib/shared/common/exceptions';
import { HttpStatus } from '@lib/shared/common/api';

// @NullAbleValue()
export class UUID extends ID<string> {
  public constructor(properties: ValueObjectProperties<string>) {
    super(properties);
  }

  public validate(properties: ValueObjectProperties<string>) {
    if (!isUUID(properties.value)) {
      throw new ArgumentInvalidException(
        getInvalidValueMessage(this),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public static generate(): UUID {
    const id = generateUUID();
    return new UUID({ value: id });
  }
}
