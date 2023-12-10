import {
  CreateCredentialPayload,
  CreateCredentialResponse,
} from '../interfaces';
import { AuthServiceProxyPort } from '../auth-service-proxy.port';
import { Injectable } from '@nestjs/common';
import { BaseResponse } from '@lib/shared/common/api';

@Injectable()
export class MockAuthServiceProxy implements AuthServiceProxyPort {
  createCredentials(
    credential: CreateCredentialPayload
  ): Promise<BaseResponse<CreateCredentialResponse>> {
    return Promise.resolve(
      new BaseResponse<CreateCredentialResponse>({
        token: 'token',
        refreshToken: 'refreshToken',
        expired: 1,
      })
    );
  }

  rollbackSaveCredential(userId: string): Promise<BaseResponse<boolean>> {
    return Promise.resolve(new BaseResponse<boolean>(true));
  }
}
