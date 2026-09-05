import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { StepHandlerMetadata } from './step.decorator';
import { Handler } from '../core';
import { err, ok } from 'neverthrow';
import { StepNotFound } from './errors';

@Injectable()
export class StepDiscoverService implements OnApplicationBootstrap {
  private map: Map<string, Handler<any>> = new Map();
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
      });
  }
  getById(id: string) {
    const handler = this.map.get(id);
    if (!handler) {
      return err(new StepNotFound(id));
    }
    return ok(handler);
  }
}
