import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { Definition } from '../definition';

export const StepKey = Symbol('step');

export type StepDefinition<Param> = Definition<Param>;

export const Step = (definition: StepDefinition<unknown>) =>
  applyDecorators(Injectable(), SetMetadata(StepKey, definition));
