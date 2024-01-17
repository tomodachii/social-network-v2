import {
  CreateCredentialPayload,
  CreateCredentialResponse,
  AuthServiceProxy,
} from '@lib/shared/service-interface';
import { Injectable } from '@nestjs/common';
import { BaseResponse } from '@lib/shared/common/api';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class HttpAuthServiceProxy implements AuthServiceProxy {
  constructor(private httpService: HttpService) {}

  async createCredentials(
    credential: CreateCredentialPayload
  ): Promise<BaseResponse<CreateCredentialResponse>> {
    const result: AxiosResponse<BaseResponse<CreateCredentialResponse>> =
      await firstValueFrom(
        this.httpService.post(
          'http://localhost:3001/create-credential/v1',
          credential
        )
      );
    const { data, meta } = result.data;

    return Promise.resolve(
      new BaseResponse<CreateCredentialResponse>(data, meta)
    );
  }

  async rollbackSaveCredential(userId: string): Promise<BaseResponse<boolean>> {
    const result: AxiosResponse<BaseResponse<boolean>> = await firstValueFrom(
      this.httpService.post('http://localhost:3001/rollback-credential/v1', {
        userId,
      })
    );

    const { data, meta } = result.data;
    return Promise.resolve(new BaseResponse<boolean>(data, meta));
  }
}
