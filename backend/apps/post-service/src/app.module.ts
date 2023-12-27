import { Module } from '@nestjs/common';
import { PostModule } from './post';
import { UserReplicaModule } from './user-replica';

@Module({
  imports: [PostModule, UserReplicaModule],
  controllers: [],
})
export class AppModule {}
