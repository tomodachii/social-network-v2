import {
  CreateCredentialPayload,
  CreateCredentialResponse,
  AuthServiceProxy,
} from '@lib/shared/service-interface';
import { Injectable } from '@nestjs/common';
import { BaseResponse } from '@lib/shared/common/api';

@Injectable()
export class MockAuthServiceProxy implements AuthServiceProxy {
  createCredentials(
    credential: CreateCredentialPayload
  ): Promise<BaseResponse<CreateCredentialResponse>> {
    return Promise.resolve(
      new BaseResponse<CreateCredentialResponse>({
        token: 'token',
        refreshToken: 'refreshToken' + credential.email,
        expired: 1,
      })
    );
  }

  rollbackSaveCredential(userId: string): Promise<BaseResponse<boolean>> {
    return Promise.resolve(
      new BaseResponse<boolean>(userId === '1' ? true : false)
    );
  }
}
