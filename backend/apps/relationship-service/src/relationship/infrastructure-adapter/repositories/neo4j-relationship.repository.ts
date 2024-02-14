import {
  RelationshipEntity,
  RelationshipRepository,
  RelationshipType,
} from '@lib/relationship/domain';
import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class Neo4jRelationshipRepository implements RelationshipRepository {
  constructor(protected readonly neo4jService: Neo4jService) {}

  async remove(
    relationship: RelationshipEntity,
    oldRelationshipType: RelationshipType
  ): Promise<boolean> {
    const relationshipProps = relationship.getProps();

    const removePath = {
      [RelationshipType.FRIEND]: 'FRIEND',
      [RelationshipType.FOLLOW]: 'FOLLOW',
      [RelationshipType.BLOCK]: 'BLOCK',
    };

    if (!removePath[oldRelationshipType]) return false;

    const result = await this.neo4jService.write(
      `
        MATCH (u:User)-[r:${oldRelationshipType.toUpperCase()}]->(m:User)
        WHERE u.id = $sourceId AND m.id = $targetId OR u.id = $targetId AND m.id = $sourceId
        DELETE r
        Return r
      `,
      {
        sourceId: relationshipProps.sourceUserId.value,
        targetId: relationshipProps.targetUserId.value,
      }
    );

    return result.records.length > 0;
  }

  async save(relationship: RelationshipEntity): Promise<boolean> {
    const relationshipProps = relationship.getProps();

    const type = relationshipProps.relationshipType;

    const mergePath = {
      [RelationshipType.FRIEND]: '(a)-[:FRIEND]->(b)-[:FRIEND]->(a)',
      [RelationshipType.FOLLOW]: '(a)-[:FOLLOW]->(b)',
      [RelationshipType.BLOCK]: '(a)-[:BLOCK]->(b)',
    };

    if (!mergePath[type]) return false;
    const result = await this.neo4jService.write(
      `
        MERGE (a:User {id: $sourceId})
        MERGE (b:User {id: $targetId})
        MERGE ${mergePath[type]}
        RETURN a,b
      `,
      {
        sourceId: relationshipProps.sourceUserId.value,
        targetId: relationshipProps.targetUserId.value,
        relationshipType: relationshipProps.relationshipType,
      }
    );

    return result.records.length > 0;
  }
}

// const transaction = this.neo4jService.beginTransaction();
// const sourceUser = await this.neo4jService.write(
//   'MERGE (u:User {id: $id}) Return u',
//   {
//     id: relationshipProps.sourceUserId.value,
//   },
//   transaction
// );
// const targetUser = await this.neo4jService.write(
//   'MERGE (u:User {id: $id}) Return u',
//   {
//     id: relationshipProps.targetUserId.value,
//   },
//   transaction
// );

// const relationshipCommand = await this.neo4jService.write(
//   `MATCH
//     (a:User {id: $sourceId}),
//     (b:User {id: $targetId})
//   MERGE (a)-[r1:FRIEND]->(b)-[r2:FRIEND]->(a)
//   RETURN r1,r2`,
//   {
//     sourceId: relationshipProps.sourceUserId.value,
//     targetId: relationshipProps.targetUserId.value,
//   },
//   transaction
// );
