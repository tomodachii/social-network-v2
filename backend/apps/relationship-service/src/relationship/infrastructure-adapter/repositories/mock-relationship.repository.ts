import {
  RelationshipEntity,
  RelationshipRepository,
} from '@lib/relationship/domain';

export class MockRelationshipRepository implements RelationshipRepository {
  async remove(relationship: RelationshipEntity): Promise<boolean> {
    return !!relationship;
  }
  async save(relationship: RelationshipEntity): Promise<boolean> {
    return !!relationship;
  }
}
