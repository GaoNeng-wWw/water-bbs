import {
  applyDecorators,
  Injectable,
  OnApplicationBootstrap,
  SetMetadata,
  Type,
} from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { err, ok, Result } from 'neverthrow';
import { BadValid, ResolverNotFound } from './error';
import { InfraError } from '@app/shared';
import { Definition } from '../definition';

export type ResolverName = string & { readonly __brand: unique symbol };

export type ResolverDefinition<Param = any> = Definition<Param>;

interface IResolver<Param, Return> {
  run(param: Param): Promise<Return> | Return;
}

type ResolverRegistryMap = Map<
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  Function | Type<any>,
  { definition: ResolverDefinition<any>; handler: IResolver<any, any> }
>;

const RESOLVER_KEY = Symbol('Resolver');
export const Resolver = <Param>(definition: ResolverDefinition<Param>) =>
  applyDecorators(Injectable(), SetMetadata(RESOLVER_KEY, definition));
type ResolverClass<T extends IResolver<any, any>> = new (...args: any[]) => T;
export class ResolverRegistry implements OnApplicationBootstrap {
  constructor(
    private readonly map: ResolverRegistryMap,
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}
  private collectFact() {
    const providers = this.discovery.getProviders();

    for (const wrapper of providers) {
      if (!wrapper.metatype) {
        continue;
      }

      const definition = this.reflector.get<ResolverDefinition>(
        RESOLVER_KEY,
        wrapper.metatype,
      );

      if (!definition) {
        continue;
      }

      this.map.set(wrapper.metatype, {
        definition,
        handler: wrapper.instance,
      });
    }
  }
  onApplicationBootstrap() {
    this.collectFact();
  }

  // fix: 类型安全
  async call<Clazz extends ResolverClass<any>>(
    resolverClass: Clazz,
    param: Parameters<InstanceType<Clazz>['run']>[0],
  ): Promise<
    Result<Awaited<ReturnType<InstanceType<Clazz>['run']>>, InfraError>
  > {
    const factKey = resolverClass as unknown as Type<any>;
    const resolver = this.map.get(factKey);
    if (!resolver) {
      return err(new ResolverNotFound(factKey.name));
    }
    const { success, error, data } =
      resolver.definition.inputSchema.safeParse(param);
    if (!success) {
      return err(new BadValid(error.message));
    }
    const res = resolver.handler.run(data);
    return res instanceof Promise ? res.then((value) => ok(value)) : ok(res);
  }
}
