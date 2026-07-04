import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { Almanac } from 'json-rules-engine';

export const FactKey = Symbol('fact');

export type IFactHandler<Params = Record<string, any>, Return = void> = {
  getFact(params: Params, almanac: Almanac): Promise<Return>;
};

export type FactMetadata = {
  name: string;
};

export const FactHandler = (name: string) =>
  applyDecorators(Injectable(), SetMetadata(FactKey, { name }));
