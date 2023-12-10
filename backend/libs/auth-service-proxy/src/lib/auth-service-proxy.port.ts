import { BaseResponse } from '@lib/shared/common/api';
import {
  CreateCredentialPayload,
  CreateCredentialResponse,
} from './interfaces';

export interface AuthServiceProxyPort {
  createCredentials(
    credential: CreateCredentialPayload
  ): Promise<BaseResponse<CreateCredentialResponse>>;
  rollbackSaveCredential(userId: string): Promise<BaseResponse<boolean>>;
}
