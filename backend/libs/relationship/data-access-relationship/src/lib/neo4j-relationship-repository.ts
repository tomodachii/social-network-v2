import {
  RelationshipEntity,
  RelationshipRepository,
} from '@lib/relationship/domain';
import { Neo4jService } from 'nest-neo4j';

export class Neo4jRelationshipRepository implements RelationshipRepository {
  constructor(protected readonly neo4jService: Neo4jService) {}

  async save(relationship: RelationshipEntity): Promise<boolean> {
    const res = await this.neo4jService.write('MERGE (u:User {id: 1})');
    await this.neo4jService.getDriver().session();
    return res.records.length > 0;
  }
}
