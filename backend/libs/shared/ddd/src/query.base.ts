/*  Most of repositories will probably need generic 
    save/find/delete operations, so it's easier
    to have some shared interfaces.
    More specific queries should be defined
    in a respective repository.
*/

import { OrderBy } from './interfaces/ports';

export class Paginated<T> {
  readonly count: number;
  readonly limit: number;
  readonly page: number;
  readonly data: readonly T[];

  constructor(props: Paginated<T>) {
    this.count = props.count;
    this.limit = props.limit;
    this.page = props.page;
    this.data = props.data;
  }
}

// export type OrderBy = { field: string | true; param: 'asc' | 'desc' };

export type PaginatedQueryParams = {
  limit: number;
  page: number;
  offset: number;
  orderBy: OrderBy;
};
/**
 * Base class for regular queries
 */
export abstract class QueryBase {}

/**
 * Base class for paginated queries
 */
export class PaginatedQuery extends QueryBase {
  limit: number;
  offset: number;
  orderBy: OrderBy;
  page: number;

  constructor(props: PaginatedParams<PaginatedQuery>) {
    super();
    this.limit = props.limit || 20;
    this.offset = props.page ? props.page * this.limit : 0;
    this.page = props.page || 0;
    this.orderBy = props.orderBy || 'ASC';
  }
}

// Paginated query parameters
export type PaginatedParams<T> = Omit<
  T,
  'limit' | 'offset' | 'orderBy' | 'page'
> &
  Partial<Omit<PaginatedQueryParams, 'offset'>>;
