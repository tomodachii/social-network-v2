import {
  AuthServiceProxyModule,
  MockAuthServiceProxy,
  HttpAuthServiceProxy,
} from '@lib/auth-service-proxy';
import { Module, Provider, Logger } from '@nestjs/common';
import { UserController } from './interface-adapter';

import { UserMapper } from './user.mapper';
import {
  AUTH_SERVICE_PROXY,
  USER_PUBLISHER,
  USER_REPOSITORY,
} from '@lib/user/feature';
import { KafkaConfig, UserPublisher, UserRepository } from './infrastructure';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../database';
import { ClientsModule } from '@nestjs/microservices';
import {
  CreateUserCommandHandler,
  FindUserByIdQueryHandler,
  UpdateAvatarCommandHandler,
  UpdateCoverCommandHandler,
} from '@lib/user/feature';
const httpControllers = [UserController];

const commandHandlers: Provider[] = [
  CreateUserCommandHandler,
  UpdateAvatarCommandHandler,
  UpdateCoverCommandHandler,
];

const queryHandlers: Provider[] = [FindUserByIdQueryHandler];

const mappers: Provider[] = [UserMapper];

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: AUTH_SERVICE_PROXY, useClass: HttpAuthServiceProxy },
  { provide: USER_PUBLISHER, useClass: UserPublisher },
];

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    AuthServiceProxyModule,
    ClientsModule.register([KafkaConfig]),
  ],
  controllers: [...httpControllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class UserModule {}
