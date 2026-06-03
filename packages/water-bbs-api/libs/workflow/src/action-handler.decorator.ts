import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

export const ActionHandlerKey = Symbol('action-handler');

export const ActionHandler = () =>
  applyDecorators(Injectable(), SetMetadata(ActionHandlerKey, true));
