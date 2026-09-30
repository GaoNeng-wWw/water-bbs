import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { StepHandlerMetadata } from './step.decorator';
import { Definition, Handler } from '../core';
import { err, ok } from 'neverthrow';
import { StepNotFound } from './errors';
import z, { ZodObject } from 'zod';

@Injectable()
export class StepDiscoverService implements OnApplicationBootstrap {
  private map: Map<string, Handler<any>> = new Map();
  private metamap: Map<string, Definition<any, any>> = new Map();
  private logger = new Logger('StepResolver');
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}
  onApplicationBootstrap() {
    this.discoveryService
      .getProviders({
        metadataKey: StepHandlerMetadata.KEY,
      })
      .forEach((value) => {
        const handler: Handler<any> = value.instance;
        const def = this.reflector.get(
          StepHandlerMetadata.KEY,
          value.metatype!,
        );

        this.logger.log(`Install ${def.key}`);
        this.map.set(def.key, handler);
        this.metamap.set(def.key, def);
      });
  }
  getById(id: string) {
    const handler = this.map.get(id);
    if (!handler) {
      return err(new StepNotFound(id));
    }
    return ok(handler);
  }
  getDefByKey(key: string) {
    const def = this.metamap.get(key);
    if (!def) {
      return err(new StepNotFound(key));
    }
    return {
      ...def,
      param: z.toJSONSchema<ZodObject>(def.param),
    };
  }
  getAllKey(page: number = 1, size: number = 20) {
    const values = Array.from(this.metamap.values());
    const ret: string[] = [];
    for (
      let i = (page - 1) * size;
      i < Math.min(page * size, values.length);
      i++
    ) {
      ret.push(values[i].key);
    }
    return { data: ret, total: values.length };
  }
  getAll() {
    const values = Array.from(this.metamap.values());
    return values.map((def) => {
      return {
        key: def.key,
        ui: def.ui,
        param: def.param,
      };
    });
  }
}
