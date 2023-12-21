import { QueryBase } from '@lib/shared/ddd-v2';

export class FindUserByIdQuery extends QueryBase {
  readonly userId: string;
  constructor(userId: string) {
    super();
    this.userId = userId;
  }
}
