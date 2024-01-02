import { Nullable } from '@lib/shared/common/types';
import { AggregateID } from '@lib/shared/ddd-v2';

export interface UserReplica {
  readonly userId: AggregateID;
  readonly version: number;
  readonly firstName: Nullable<string>;
  readonly lastName: Nullable<string>;
  readonly avatarFileId: Nullable<AggregateID>;
}
