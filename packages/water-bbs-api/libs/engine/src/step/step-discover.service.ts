import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { StepHandlerMetadata } from './step.decorator';
import { Handler } from '../core';
import { err, ok } from 'neverthrow';
import { StepNotFound } from './errors';

@Injectable()
export class StepDiscoverService implements OnApplicationBootstrap {
  private map: Map<string, Handler<any, any, any>> = new Map();
  constructor(private readonly discoveryService: DiscoveryService) {}
  onApplicationBootstrap() {
    const handlers = this.discoveryService
      .getProviders({
        metadataKey: StepHandlerMetadata.KEY,
      })
      .map((value) => {
        const handler: Handler<any, any, any> = value.instance;
        return handler;
      });
    handlers.forEach((handle) => {
      this.map.set(handle.definition.key, handle);
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
