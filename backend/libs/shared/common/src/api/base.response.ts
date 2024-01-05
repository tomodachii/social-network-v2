import { HttpStatus } from '@lib/shared/common/api';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectLiteral } from '../types';

interface ResponseMetaData {
  message: string | string[];
  isSuccess: boolean;
  status: HttpStatus;
  serviceId: string;
  extraMeta: ObjectLiteral;
}

export class BaseResponse<T> {
  @ApiProperty()
  meta: ResponseMetaData;

  @ApiProperty()
  data: T;

  constructor(
    data: T,
    meta: ResponseMetaData = {
      message: '',
      isSuccess: true,
      status: HttpStatus.OK,
      serviceId: '',
      extraMeta: {},
    }
  ) {
    this.data = data;
    this.meta = meta;
  }
}
