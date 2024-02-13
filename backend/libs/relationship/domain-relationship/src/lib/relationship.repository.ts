import { Nullable } from '@lib/shared/common/types';
import { RelationshipEntity } from './relationship.entity';

export interface RelationshipRepository {
  save(relationship: RelationshipEntity): Promise<boolean>;
  // find(
  //   sourceUserId: string,
  //   targetUserId: string
  // ): Promise<Nullable<RelationshipEntity>>;
}
