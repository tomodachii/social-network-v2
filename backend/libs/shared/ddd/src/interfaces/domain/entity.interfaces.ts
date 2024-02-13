import { Nullable } from '@lib/shared/common/types';
import type { CreatedAt, UpdatedAt, DeletedAt } from '../../value-objects';

export interface BaseEntityProps<T> {
  id: T;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt: Nullable<DeletedAt>;
}

export interface EntityProps<T, V> {
  id: T;
  props: V;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: Nullable<DeletedAt>;
}

export type GetterCustomEntityProps<V> = {
  [K in keyof V]: V[K];
};

export type GetterNativeEntityProps<T> = {
  id: T;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: Nullable<DeletedAt>;
};

export type GetterEntityProps<T, V> = GetterNativeEntityProps<T> &
  GetterCustomEntityProps<V>;

export type SetterCustomEntityProps<V> = {
  [K in keyof V]: V[K];
};

export type SetterNativeEntityProps<T> = {
  id: T;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: Nullable<DeletedAt>;
};

export type SetterEntityProps<T, V> = SetterNativeEntityProps<T> &
  SetterCustomEntityProps<V>;
