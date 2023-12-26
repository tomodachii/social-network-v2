import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { KafkaUserConsumer } from './interface-adapter';
import { SaveUserReplicaCommandHandler } from '@lib/post/replica-user';
import { DataAccessPostModule } from '@lib/post/data-access';

const commandHandler = [SaveUserReplicaCommandHandler];

@Module({
  imports: [CqrsModule, DataAccessPostModule],
  controllers: [KafkaUserConsumer],
  providers: [Logger, ...commandHandler],
})
export class UserReplicaModule {}
