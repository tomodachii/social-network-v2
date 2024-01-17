import { Injectable } from '@nestjs/common';
import { BaseResponse } from '@lib/shared/common/api';
import {
  GetUserInfoMessageResponse,
  UserServiceProxy,
} from '@lib/shared/service-interface';

@Injectable()
export class MockUserServiceProxy implements UserServiceProxy {
  getUserInfo(id: string): Promise<BaseResponse<GetUserInfoMessageResponse>> {
    const user: GetUserInfoMessageResponse = {
      id: id,
      avatarFileId: '1',
      firstName: 'John',
      lastName: 'Doe',
    };
    return Promise.resolve(new BaseResponse<GetUserInfoMessageResponse>(user));
  }
}
