import { Module } from '@nestjs/common';
import { PostModule } from './post';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from '@lib/shared/common/application';
import { RequestContextModule } from 'nestjs-request-context';
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
  imports: [PostModule, RequestContextModule],
  providers: [...interceptors],
  controllers: [],
})
export class AppModule {}
