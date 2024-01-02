import { Module } from '@nestjs/common';
import { PostModule } from './post';

@Module({
  imports: [PostModule],
  controllers: [],
})
export class AppModule {}
