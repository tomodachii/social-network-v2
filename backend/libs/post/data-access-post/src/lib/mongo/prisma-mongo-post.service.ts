import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/post-mongodb';

export * from '@prisma/client/post-mongodb';

@Injectable()
export class PrismaMongoPostService
  extends PrismaClient
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaMongoPostService.name);
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'colorless',
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
