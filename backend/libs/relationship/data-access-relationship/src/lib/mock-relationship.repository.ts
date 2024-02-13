import {
  RelationshipEntity,
  RelationshipRepository,
} from '@lib/relationship/domain';

export class MockRelationshipRepository implements RelationshipRepository {
  async save(relationship: RelationshipEntity): Promise<boolean> {
    return !!relationship;
  }
}
