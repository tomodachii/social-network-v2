import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContextInterceptor } from '@lib/shared/common/application';
import { RequestContextModule } from 'nestjs-request-context';
import { UserModule } from './user/user.module';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  // {
  //   provide: APP_INTERCEPTOR,
  //   useClass: ExceptionInterceptor,
  // },
];

@Module({
  imports: [
    RequestContextModule,
    CqrsModule,
    // Modules
    UserModule,
  ],
  controllers: [],
  providers: [...interceptors],
})
export class AppModule {}
