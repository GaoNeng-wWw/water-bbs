import z from 'zod';
import { Definition, uiSchema } from '../core';
import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

export const StepKey = Symbol('step');

export const StepHandlerMetadata =
  DiscoveryService.createDecorator<Definition<any, any, any>>();

export const Step = <
  UiSchema extends z.infer<typeof uiSchema>[],
  Param extends z.ZodType,
  Events extends unknown[],
>(
  def: Definition<UiSchema, Param, Events>,
) =>
  applyDecorators(
    StepHandlerMetadata(def),
    SetMetadata(StepKey, true),
    Injectable(),
  );
