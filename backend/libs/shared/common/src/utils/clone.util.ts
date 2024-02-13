import { isNull, isUndefined } from './shared.utils';

/**
 * Clone object.
 * @param target
 * @param argsCtor
 */
export const clone = <T>(target: unknown, argsCtor: unknown[]) => {
  if (isNull(target) || isUndefined(target)) {
    return;
  }
  const prototype = Reflect.getPrototypeOf(target as object);
  if (prototype) {
    return Reflect.construct(prototype.constructor, argsCtor) as unknown as T;
  }
  throw new Error("Can't get prototype of target");
};
