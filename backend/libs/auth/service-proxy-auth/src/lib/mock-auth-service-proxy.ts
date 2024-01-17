import {
  CreateCredentialMessageRequest,
  CreateCredentialMessageResponse,
  AuthServiceProxy,
} from '@lib/shared/service-interface';
import { Injectable } from '@nestjs/common';
import { BaseResponse } from '@lib/shared/common/api';

@Injectable()
export class MockAuthServiceProxy implements AuthServiceProxy {
  createCredentials(
    credential: CreateCredentialMessageRequest
  ): Promise<BaseResponse<CreateCredentialMessageResponse>> {
    return Promise.resolve(
      new BaseResponse<CreateCredentialMessageResponse>({
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
