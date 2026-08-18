import { Injectable, OnApplicationBootstrap, Type } from '@nestjs/common';
import { StepDefinition, StepKey } from './step.decorator';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { err, ok, Result } from 'neverthrow';
import { StepNotFound } from './error';
import { InfraError } from '@app/shared';

export interface IStep<Param, Return> {
  run(param: Param): Promise<Return> | Return;
}

type StepClass<T extends IStep<any, any>> = new (...args: any[]) => T;
type StepRegistryMap = Map<
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  Function | Type<any>,
  { definition: StepDefinition<any>; handler: IStep<any, any> }
>;

@Injectable()
export class StepDiscoverService implements OnApplicationBootstrap {
  constructor(
    private readonly map: StepRegistryMap,
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}
  private collectSteps() {
    const providers = this.discovery.getProviders();

    for (const wrapper of providers) {
      if (!wrapper.metatype) {
        continue;
      }

      const definition = this.reflector.get<StepDefinition<any>>(
        StepKey,
        wrapper.metatype,
      );

      if (!definition) {
        continue;
      }

      this.map.set(wrapper.metatype as StepClass<any>, {
        definition,
        handler: wrapper.instance,
      });
    }
  }
  onApplicationBootstrap() {
    this.collectSteps();
  }
  call<Clazz extends StepClass<any>>(
    stepClass: Clazz,
    param: Parameters<InstanceType<Clazz>['run']>[0],
  ): Result<Awaited<ReturnType<InstanceType<Clazz>['run']>>, InfraError> {
    const stepKey = stepClass as unknown as Type<any>;
    const step = this.map.get(stepKey);
    if (!step) {
      return err(new StepNotFound(stepKey.name));
    }
    return ok(step.handler.run(param));
  }
}
