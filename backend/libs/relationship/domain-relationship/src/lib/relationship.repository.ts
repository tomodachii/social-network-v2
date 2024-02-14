// import { Nullable } from '@lib/shared/common/types';
import { RelationshipEntity } from './relationship.entity';
import { RelationshipType } from './relationship.type';

export interface RelationshipRepository {
  save(relationship: RelationshipEntity): Promise<boolean>;
  remove(
    relationship: RelationshipEntity,
    oldRelationshipType: RelationshipType
  ): Promise<boolean>;
  // find(
  //   sourceUserId: string,
  //   targetUserId: string
  // ): Promise<Nullable<RelationshipEntity>>;
}
