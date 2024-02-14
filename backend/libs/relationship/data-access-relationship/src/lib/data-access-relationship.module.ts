import { Module } from '@nestjs/common';
import { Neo4jModule } from 'nest-neo4j';

@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: '12345678',
    }),
  ],
  exports: [Neo4jModule],
})
export class DataAccessRelationshipModule {}
