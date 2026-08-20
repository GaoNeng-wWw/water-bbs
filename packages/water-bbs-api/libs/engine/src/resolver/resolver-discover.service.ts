import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { ResolverHandlerMetadata } from './resolver.decorator';
import { Handler, InjectEngine } from '../core';
import { Engine } from 'json-rules-engine';
import { EntityManager } from '@mikro-orm/sqlite';
import z from 'zod';

@Injectable({})
export class ResolverDiscoverService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger();
  constructor(
    private readonly discoveryService: DiscoveryService,
    @InjectEngine()
    private readonly engine: Engine,
    private readonly em: EntityManager,
  ) {}
  onApplicationBootstrap() {
    this.discoveryService
      .getProviders()
      .map((instance) => {
        const mt = this.discoveryService.getMetadataByDecorator(
          ResolverHandlerMetadata,
          instance,
        );
        const ins = instance.instance as Handler<
          any,
          z.ZodObject,
          []
        >['handle'];
        return { metatype: mt, instance: ins };
      })
      .filter(({ metatype }) => metatype !== undefined)
      .forEach(({ metatype, instance }) => {
        if (!metatype) {
          return;
        }
        this.logger.log(`${metatype.key} discovered`);
        this.engine.addFact(metatype.key, (param) => {
          instance(param, {
            em: this.em,
            events: [],
          });
        });
      });
  }
}
