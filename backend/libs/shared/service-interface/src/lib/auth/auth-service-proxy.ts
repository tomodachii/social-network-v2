import { BaseResponse } from '@lib/shared/common/api';
import {
  CreateCredentialMessageRequest,
  CreateCredentialMessageResponse,
} from './messages';

export interface AuthServiceProxy {
  createCredentials(
    credential: CreateCredentialMessageRequest
  ): Promise<BaseResponse<CreateCredentialMessageResponse>>;
  rollbackSaveCredential(userId: string): Promise<BaseResponse<boolean>>;
}
