import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

export const ActionHandlerKey = Symbol('action-handler');
export const ActionHandler = (name?: string) =>
  applyDecorators(Injectable(), SetMetadata(ActionHandlerKey, { name }));
