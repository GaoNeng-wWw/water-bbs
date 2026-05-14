import { SetMetadata, Type } from '@nestjs/common';

export const USE_MODEL_TOKEN = Symbol('USE_MODEL_TOKEN');

export const UseModel = <T>(model: Type<T>) =>
  SetMetadata(USE_MODEL_TOKEN, model);
