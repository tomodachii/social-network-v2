import { DeepPartial } from '@lib/shared/common/types';
import { EntityProps } from '../domain';

export interface CommandRepository<Entity, EntityProps> {
  create(entity: Entity): Promise<Entity> | never;
  update(id: unknown, entity: Entity): Promise<Entity> | never;
  bulkCreate(entities: Entity[]): Promise<Entity[]> | never;
  bulkUpdate(entities: Entity[]): Promise<Entity[]> | never;
  remove(entities: Entity[]): Promise<boolean> | never;
  destroy(props: EntityProps): Promise<number> | never;
}

export type QueryParams<Props> = DeepPartial<EntityProps<unknown, Props>>;

export type OrderBy = 'DESC' | 'ASC';

export interface FindParams<EntityProps> {
  params?: QueryParams<EntityProps>;
  pagination?: PaginationParams;
  orderBy?: OrderBy;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
  page?: number;
}

export interface DataWithPaginationMeta<T> {
  data: T;
  count: number;
  offset?: number;
  limit?: number;
  page?: number;
}

export interface QueryRepository<Entity, EntityProps> {
  find(
    options: FindParams<EntityProps>
  ): Promise<DataWithPaginationMeta<Entity[]>>;
  findById(id: unknown): Promise<Entity> | never;
  findOne(params: QueryParams<EntityProps>): Promise<Entity> | never;
}
