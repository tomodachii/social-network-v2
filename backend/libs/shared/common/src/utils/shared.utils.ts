import validator from 'validator';

export const isUndefined = (input: unknown): input is undefined =>
  typeof input === 'undefined';

export const isNull = (input: unknown): input is null => input === null;

export const isObject = (input: unknown): input is object =>
  !isNull(input) && typeof input === 'object';

export const isPlainObject = (input: unknown): input is object => {
  if (!isObject(input)) {
    return false;
  }
  const proto = Object.getPrototypeOf(input);
  if (proto === null) {
    return true;
  }
  const ctor =
    Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
    proto.constructor;
  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) ===
      Function.prototype.toString.call(Object)
  );
};

export const isDate = (input: unknown): input is Date =>
  validator.isDate(input as string);

export const isFunction = (input: unknown): boolean =>
  typeof input === 'function';

export const isString = (input: unknown): input is string =>
  typeof input === 'string';

export const isNumber = (input: unknown): input is number =>
  typeof input === 'number';

export const isEmptyArray = (input: unknown): boolean =>
  !(Array.isArray(input) && input.length > 0);

export const isEmptyObject = (input: unknown): boolean => {
  return JSON.stringify(input) === '{}';
};

export const isSymbol = (input: unknown): input is symbol =>
  typeof input === 'symbol';
