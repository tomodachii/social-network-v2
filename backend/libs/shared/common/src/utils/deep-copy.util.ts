import { ObjectLiteral } from '../types';
import { isDate, isFunction, isNull, isObject } from './shared.utils';

/**
 * Deep copy object.
 * @param target
 */
export const deepCopy = <T>(target: T): T => {
  if (isNull(target)) {
    return target;
  }
  if (isDate(target)) {
    return new Date(target.getTime()) as unknown as T;
  }

  if (!isObject(target)) {
    return target;
  }

  if (isFunction(target)) {
    const cpi = [] as unknown[];
    if ((target as unknown as unknown[]).length > 0) {
      for (const arrayMember of target as unknown[]) {
        cpi.push(deepCopy(arrayMember));
      }
    }
    return cpi as unknown as T;
  }
  const targetKeys = Object.keys(target);
  const cpo: Record<string, unknown> = {};

  if (targetKeys.length > 0) {
    for (const key of targetKeys) {
      cpo[key as string] = deepCopy((target as ObjectLiteral)[key]);
    }
  }
  return cpo as unknown as T;
};
