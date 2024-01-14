import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  PrismaClient,
  PostRecord,
  AttachmentRecord,
  CommentRecord,
  ReactRecord,
} from '@prisma/client/post';

export {
  PostRecord,
  AttachmentRecord,
  CommentRecord,
  ReactRecord,
} from '@prisma/client/post';

export type CommentPersistent = CommentRecord & {
  reacts: ReactRecord[];
  attachments: AttachmentRecord[];
  replies: CommentPersistent[];
};

export type PostPersistent = PostRecord & {
  attachments: AttachmentRecord[];
  comments: CommentPersistent[];
  reacts: ReactRecord[];
} & { version?: number };

@Injectable()
export class PrismaMysqlPostService
  extends PrismaClient
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaMysqlPostService.name);
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'colorless',
    });
  }
  async onModuleInit() {
    await this.$connect();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('query', async (e) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(`\n${e.query} ${e.params}`);
    });
  }
}
