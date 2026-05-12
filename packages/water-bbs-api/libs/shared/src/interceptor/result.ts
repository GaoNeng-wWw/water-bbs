import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isObject } from 'class-validator';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { isOk, isResult } from 'water-bbs-shared';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (isResult(data)) {
          if (isOk(data)) {
            return isObject(data.value) ? data.value : {};
          }
          return data.error;
        }
        if (isObject(data)) {
          return data;
        }
        return {};
      }),
    );
  }
}
