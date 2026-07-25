import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from 'neverthrow';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (this.isResult(data)) {
          if (data.isErr()) {
            throw data.error;
          }
          return data.value;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
      }),
    );
  }

  private isResult<T, E>(value: unknown): value is Result<T, E> {
    return (
      typeof value === 'object' &&
      value !== null &&
      'isOk' in value &&
      'isErr' in value &&
      typeof (value as any).isOk === 'function' &&
      typeof (value as any).isErr === 'function'
    );
  }
}
