import { err, ok, pipeResult, Result } from 'water-bbs-shared';
import {
  FeatureParseError,
  FeaturesLoaderError,
  IFeatureLoader,
} from '../../application';
import { RedisService } from '@nestjs-redisx/core';
import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

const COMMON_KET = 'FEATURE';

@Injectable()
export class RedisFeatureLoader implements IFeatureLoader<string> {
  constructor(private readonly redis: RedisService) {}
  load<Output>(
    schema: ZodType<Output>,
    fields: string[],
  ): Promise<Result<Output, FeaturesLoaderError>> {
    const handle = this.redis
      .hmget(COMMON_KET, ...fields)
      .then((resp) => {
        const { data, success, error } = schema.safeParse(resp);
        if (!success) {
          return err(new FeaturesLoaderError(new FeatureParseError(error)));
        }
        return ok(data);
      })
      .catch((reason) => {
        return err(new FeaturesLoaderError(reason, { reason }));
      });
    return handle;
  }
  put(
    name: string,
    value: string,
  ): Promise<Result<string, FeaturesLoaderError>> {
    return this.redis
      .hset(COMMON_KET, name, `${value}`)
      .then(() => {
        return ok(value);
      })
      .catch((reason) => {
        return err(new FeaturesLoaderError(reason, { reason }));
      });
  }
  async putMany<O>(record: O): Promise<Result<O, FeaturesLoaderError>> {
    const value = this.redis
      .hgetall(COMMON_KET)
      .then((value) => ok(value ?? {}))
      .catch((reason) => err(new FeaturesLoaderError(reason, { reason })));
    const valueHandle = pipeResult(await value);
    if (valueHandle.isOk()) {
      const putValue = { ...valueHandle.value, ...record };
      return this.redis
        .hmset(COMMON_KET, putValue)
        .then(() => ok(record))
        .catch((reason) => err(new FeaturesLoaderError(reason, { reason })));
    }
    return err(valueHandle.unwrapErr());
  }
}
