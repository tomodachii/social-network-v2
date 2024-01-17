import { BaseResponse } from '@lib/shared/common/api';
import { GetUserInfoMessageResponse } from './messages';

export interface UserServiceProxy {
  getUserInfo(id: string): Promise<BaseResponse<GetUserInfoMessageResponse>>;
}
