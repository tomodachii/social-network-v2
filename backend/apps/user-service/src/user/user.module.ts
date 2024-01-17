import {
  AuthServiceProxyModule,
  MockAuthServiceProxy,
  HttpAuthServiceProxy,
} from '@lib/auth-service-proxy';
import { Module, Provider, Logger } from '@nestjs/common';
import { HttpUserController } from './interface-adapter';

import {
  AUTH_SERVICE_PROXY,
  USER_PRODUCER,
  USER_REPOSITORY,
} from '@lib/user/feature';
import {
  KafkaConfig,
  KafkaUserProducer,
  MysqlUserRepository,
  MysqlUserMapper,
} from './infrastructure-adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { DataAccessUserModule } from '@lib/user/data-access';
import { ClientsModule } from '@nestjs/microservices';
import {
  CreateUserCommandHandler,
  FindUserByIdQueryHandler,
  UpdateAvatarCommandHandler,
  UpdateCoverCommandHandler,
} from '@lib/user/feature';
const httpControllers = [HttpUserController];

const commandHandlers: Provider[] = [
  CreateUserCommandHandler,
  UpdateAvatarCommandHandler,
  UpdateCoverCommandHandler,
];

const queryHandlers: Provider[] = [FindUserByIdQueryHandler];

const mappers: Provider[] = [MysqlUserMapper];

const infra: Provider[] = [
  { provide: USER_REPOSITORY, useClass: MysqlUserRepository },
  { provide: AUTH_SERVICE_PROXY, useClass: HttpAuthServiceProxy },
  { provide: USER_PRODUCER, useClass: KafkaUserProducer },
];

@Module({
  imports: [
    CqrsModule,
    DataAccessUserModule,
    AuthServiceProxyModule,
    ClientsModule.register([KafkaConfig]),
  ],
  controllers: [...httpControllers],
  providers: [
    Logger,
    ...infra,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class UserModule {}
