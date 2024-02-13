import { Entity } from '../entities/entity';
import { clone, isNull, isUndefined } from '@lib/shared/common/utils';
// import { VALUE_OBJECT_NULLABLE_METADATA } from '../constants';
import {
  DomainPrimitive,
  DomainPrimitiveProperties,
  ValueObject,
} from '../value-objects';
import { ObjectLiteral } from '@lib/shared/common/types';

export const isDomainPrimitiveProperties = <T = DomainPrimitive>(
  target: unknown
): target is DomainPrimitiveProperties<T> => {
  const value = (target as DomainPrimitiveProperties<T>)?.value;
  return Boolean(target && value !== undefined);
};

export const isValueObject = (target: unknown): target is ValueObject => {
  if (target === null || target === undefined) {
    return false;
  }
  return target instanceof ValueObject;
};

export const isDomainEntity = (target: unknown): target is Entity => {
  if (target === null || target === undefined) {
    return false;
  }
  return target instanceof Entity;
};

// export const cloneEntityProps = <T>(target: unknown, props: any): T | any => {
//   if (isDomainEntity(props)) {
//     return props.clone();
//   }
//   if (isValueObject(target)) {
//     return target.clone();
//   }

//   if (Array.isArray(props)) {
//     const objects = [];
//     for (const p of props) {
//       objects.push(cloneEntityProps(p, p));
//     }
//     return objects;
//   }
//   const entityPropsClone: ObjectLiteral = {};
//   for (const ep of Object.keys(props)) {
//     entityPropsClone[ep] = cloneEntityProps(props[ep], props[ep]);
//   }
//   return entityPropsClone as unknown as T;
// };

export const cloneValueObjectProps = <VO>(
  target: unknown,
  voProps: unknown
): VO | unknown => {
  if (voProps === null || voProps === undefined) {
    return clone(this, [{ value: null }]);
  }

  if (isDomainPrimitiveProperties(voProps)) {
    return clone(this, [{ value: voProps.value }]);
  }

  if (!(voProps as ObjectLiteral)['value']) {
    return clone(target, [voProps]);
  }

  const voPropsClone: ObjectLiteral = {};

  for (const [key, value] of Object.entries(voProps)) {
    voPropsClone[key] = cloneValueObjectProps(
      (voProps as ObjectLiteral)[key],
      value
    );
  }

  return voPropsClone as unknown as VO;
};
export const valueObjectToPlain = <T>(target: any): T | any => {
  if (isUndefined(target)) {
    return null;
  }

  if (
    isNull(target) ||
    typeof target === 'number' ||
    typeof target === 'string' ||
    typeof target === 'symbol'
  ) {
    return target;
  }

  if (isDomainEntity(target)) {
    return target.toObject();
  }

  if (isDomainPrimitiveProperties(target)) {
    return target.value;
  }

  if (Array.isArray(target)) {
    const cp = [];
    for (const item of target) {
      cp.push(valueObjectToPlain(item));
    }
    return cp;
  }

  const cpo: ObjectLiteral = {};

  const keys = Object.keys(target);
  if (keys.length > 0) {
    for (const key of keys) {
      cpo[key] = valueObjectToPlain(target[key]);
    }
  }

  return cpo as unknown as T;
};

export const getInvalidValueMessage = (
  vo: ValueObject<unknown>,
  msg?: string
) => {
  if (msg) {
    return msg;
  }
  return `${vo.constructor.name} value invalid`;
};

// export const getNullableConfig = (name: string) => {
//   return getMetadataByKey<boolean>(`${VALUE_OBJECT_NULLABLE_METADATA}.${name}`);
// };
