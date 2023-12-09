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
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    /**
     * Setting an ID in the global context for each request.
     * This ID can be used as correlation id shown in logs
     */
    const requestId = request?.body?.requestId ?? nanoid(6);
    const userId = request?.user?.id ?? null;

    RequestContextService.setRequestId(requestId);
    RequestContextService.setUserId('84fb0450-6f0f-43be-86e4-8ec1c76b0d15');
    // console.log(request?.header('x-username'));

    return next.handle().pipe(
      tap(() => {
        // Perform cleaning if needed
      })
    );
  }
}
