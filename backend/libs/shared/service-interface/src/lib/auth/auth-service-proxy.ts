import { BaseResponse } from '@lib/shared/common/api';
import { CreateCredentialPayload, CreateCredentialResponse } from './messages';

export interface AuthServiceProxy {
  createCredentials(
    credential: CreateCredentialPayload
  ): Promise<BaseResponse<CreateCredentialResponse>>;
  rollbackSaveCredential(userId: string): Promise<BaseResponse<boolean>>;
}
