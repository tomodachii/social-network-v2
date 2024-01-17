import { Module } from '@nestjs/common';
import { HttpUserServiceProxy } from './http-user-service-proxy';
import { HttpModule } from '@nestjs/axios';
import { MockUserServiceProxy } from './mock-user-service-proxy';

@Module({
  controllers: [HttpModule],
  providers: [HttpUserServiceProxy, MockUserServiceProxy],
  exports: [HttpModule, HttpUserServiceProxy, MockUserServiceProxy],
})
export class ServiceProxyUserModule {}
