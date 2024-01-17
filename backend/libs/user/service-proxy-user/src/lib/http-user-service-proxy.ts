import {
  GetUserInfoMessageResponse,
  UserServiceProxy,
} from '@lib/shared/service-interface';
import { Injectable } from '@nestjs/common';
import { BaseResponse } from '@lib/shared/common/api';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

// @Injectable()
// export class HttpAuthServiceProxy implements AuthServiceProxy {
//   constructor(private httpService: HttpService) {}

//   async createCredentials(
//     credential: CreateCredentialMessageRequest
//   ): Promise<BaseResponse<CreateCredentialMessageResponse>> {
//     const result: AxiosResponse<BaseResponse<CreateCredentialMessageResponse>> =
//       await firstValueFrom(
//         this.httpService.post(
//           'http://localhost:3001/create-credential/v1',
//           credential
//         )
//       );
//     const { data, meta } = result.data;

//     return Promise.resolve(
//       new BaseResponse<CreateCredentialMessageResponse>(data, meta)
//     );
//   }

//   async rollbackSaveCredential(userId: string): Promise<BaseResponse<boolean>> {
//     const result: AxiosResponse<BaseResponse<boolean>> = await firstValueFrom(
//       this.httpService.post('http://localhost:3001/rollback-credential/v1', {
//         userId,
//       })
//     );

//     const { data, meta } = result.data;
//     return Promise.resolve(new BaseResponse<boolean>(data, meta));
//   }
// }

@Injectable()
export class HttpUserServiceProxy implements UserServiceProxy {
  constructor(protected readonly httpService: HttpService) {}

  async getUserInfo(
    userId: string
  ): Promise<BaseResponse<GetUserInfoMessageResponse>> {
    const result: AxiosResponse<BaseResponse<GetUserInfoMessageResponse>> =
      await firstValueFrom(
        this.httpService.get(`http://localhost:3002/users/v1/${userId}}`)
      );
    const { data, meta } = result.data;

    return Promise.resolve(
      new BaseResponse<GetUserInfoMessageResponse>(data, meta)
    );
  }
}
