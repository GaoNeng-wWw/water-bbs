import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { StepDiscoverService } from './step-discover.service';

@Injectable()
export class StepRunner {
  constructor(private readonly stepDiscover: StepDiscoverService) {}
  async run<T extends Record<string, any>>(
    stepId: string,
    param: T,
    em: EntityManager,
  ) {
    const step = this.stepDiscover.getById(stepId);
    if (step.isErr()) {
      return step;
    }
    return step.value.handle(param, {
      em,
      events: [],
    });
  }
}
