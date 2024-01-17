import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MockAuthServiceProxy } from './mock-auth-service-proxy';
import { HttpAuthServiceProxy } from './http-auth-service-proxy';

@Module({
  imports: [HttpModule],
  providers: [MockAuthServiceProxy, HttpAuthServiceProxy],
  exports: [HttpModule, MockAuthServiceProxy, HttpAuthServiceProxy],
})
export class AuthServiceProxyModule {}
