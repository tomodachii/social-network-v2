import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { KafkaUserConsumer } from './interface-adapter';
import {
  SaveUserReplicaCommandHandler,
  UpdateAvatarUserReplicaCommandHandler,
} from '@lib/post/replica-user';
import { DataAccessPostModule } from '@lib/post/data-access';

const commandHandler = [
  SaveUserReplicaCommandHandler,
  UpdateAvatarUserReplicaCommandHandler,
];

@Module({
  imports: [CqrsModule, DataAccessPostModule],
  controllers: [KafkaUserConsumer],
  providers: [Logger, ...commandHandler],
})
export class UserReplicaModule {}
