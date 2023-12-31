import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { nanoid } from 'nanoid';
import { RequestContextService } from './AppRequestContext';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    /**
     * Setting an ID in the global context for each request.
     * This ID can be used as correlation id shown in logs
     */
    const requestId = request?.body?.requestId ?? nanoid(6);
    const userId = request.headers['x-userid'] ?? null;

    RequestContextService.setRequestId(requestId);
    RequestContextService.setUserId(userId);
    console.log(userId);
    return next.handle().pipe(
      tap(() => {
        // Perform cleaning if needed
      })
    );
  }
}
