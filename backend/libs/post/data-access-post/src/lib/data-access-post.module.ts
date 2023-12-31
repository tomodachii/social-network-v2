import { Module } from '@nestjs/common';
import { PrismaMysqlPostService } from './mysql/prisma-mysql-post.service';
import { PrismaMongoPostService } from './mongo/prisma-mongo-post.service';

@Module({
  providers: [PrismaMongoPostService, PrismaMysqlPostService],
  exports: [PrismaMongoPostService, PrismaMysqlPostService],
})
export class DataAccessPostModule {}
