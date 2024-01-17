import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../api';

interface ClassConstructor {
  new (...args: unknown[]): unknown;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> {
    return next.handle().pipe(
      map((response: unknown) => {
        if (response instanceof BaseResponse) {
          if (response.data instanceof Array) {
            return new BaseResponse(
              response.data.map((item) => serializeObject(this.dto, item))
            );
          }
          return new BaseResponse(serializeObject(this.dto, response));
        }
        return response;
      })
    );
  }
}

export const serializeObject = (dto: ClassConstructor, data: unknown) => {
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
  });
};
