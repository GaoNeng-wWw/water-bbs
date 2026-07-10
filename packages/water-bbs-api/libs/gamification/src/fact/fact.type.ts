import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { Almanac } from 'json-rules-engine';
import { ZodType } from 'zod';

export const FactKey = Symbol('fact');

export type IFactHandler<Params = Record<string, any>, Return = void> = {
  getFact(params: Params, almanac: Almanac): Promise<Return>;
};

export type FactMetadata = {
  name: string;
  returnType: ZodType;
};

export const FactHandler = (name: string, returnType: ZodType) =>
  applyDecorators(Injectable(), SetMetadata(FactKey, { name, returnType }));
