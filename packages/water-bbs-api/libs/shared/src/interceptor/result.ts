import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { isObject } from 'class-validator';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { AppError, isOk, isResult } from 'water-bbs-shared';
import { USE_MODEL_TOKEN } from '../decorator/use-model';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { isArray } from 'radashi';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const model = this.reflector.get<Type<any>>(
      USE_MODEL_TOKEN,
      context.getHandler(),
    );
    return next.handle().pipe(
      map((data) => {
        if (isResult(data)) {
          if (isOk(data)) {
            return isObject(data.value)
              ? plainToInstance<object, object>(model, data.value, {
                  excludeExtraneousValues: true,
                })
              : data.value;
          }
          const err = data.error as AppError;
          console.log(err);
          throw new HttpException(err.message, err.code, {
            cause: err.code >= 499 ? {} : err.cause,
          });
        }
        if (isObject(data)) {
          return plainToInstance<object, object>(model, data, {
            excludeExtraneousValues: true,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
      }),
    );
  }
}
