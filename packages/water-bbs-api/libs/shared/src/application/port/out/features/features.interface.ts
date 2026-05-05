import { Result } from 'water-bbs-shared';
import { FeaturesLoaderError } from './features.error';
import { Inject } from '@nestjs/common';
import { ZodType } from 'zod';

export interface IFeatureLoader<PutValue> {
  load<Output>(
    schema: ZodType<Output>,
    name: string[],
  ): Promise<Result<Output, FeaturesLoaderError>>;
  put(
    name: string,
    value: PutValue,
  ): Promise<Result<PutValue, FeaturesLoaderError>>;
  putMany<O>(record: O): Promise<Result<O, FeaturesLoaderError>>;
}

export const FEATURE_LOADER_TOKEN = Symbol('FEATURE_LOADER');

export const InjectFeatureLoader = () => Inject(FEATURE_LOADER_TOKEN);
