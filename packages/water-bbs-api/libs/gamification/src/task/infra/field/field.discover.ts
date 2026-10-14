import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { IFieldProvider, FieldMetadata, Field } from './field.decorator';
import { err, ok } from 'neverthrow';
import { FieldNotFound } from '../error';
import { EntityManager } from '@mikro-orm/core';
import { Fields } from '../../schema';

@Injectable()
export class FieldDiscoverService implements OnApplicationBootstrap {
  private readonly logger = new Logger(FieldDiscoverService.name);
  private readonly metadata: Map<string, FieldMetadata> = new Map();
  private readonly handlers: Map<string, IFieldProvider<any, any>> = new Map();
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly em: EntityManager,
  ) {}
  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();
    for (const provider of providers) {
      const metatype = this.discoveryService.getMetadataByDecorator(
        Field,
        provider,
      );
      if (!metatype) {
        continue;
      }
      this.metadata.set(metatype.name, metatype);
      this.handlers.set(metatype.name, provider.instance);
      this.logger.log(`Field ${metatype.name} registered.`);
    }
  }
  async callHandler(name: Fields, params: any) {
    const handler = this.handlers.get(name);
    if (!handler) {
      return err(new FieldNotFound(name));
    }
    const date = new Date();
    if (name === 'time.now.day') {
      return Promise.resolve(ok(date.getDate()));
    }
    if (name === 'time.now.month') {
      return Promise.resolve(ok(date.getMonth() + 1));
    }
    if (name === 'time.now.year') {
      return Promise.resolve(ok(date.getFullYear()));
    }
    if (name === 'time.now.hour') {
      return Promise.resolve(ok(date.getHours()));
    }
    if (name === 'time.now.weekday') {
      return Promise.resolve(ok(date.getDay().toString()));
    }
    return handler.execute(params, { em: this.em.fork() });
  }
}
