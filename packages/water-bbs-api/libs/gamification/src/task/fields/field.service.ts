import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { FieldProvider, FieldHandlerMetadata } from './fields.decorator';
import { AccountId } from 'src/auth';
import { err } from 'neverthrow';
import { UnknownField } from '../error';

@Injectable()
export class FieldService implements OnApplicationBootstrap {
  private logger = new Logger('FieldProvider');
  private map: Map<string, FieldProvider<any, any>> = new Map();
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}
  onApplicationBootstrap() {
    this.discoveryService
      .getProviders({
        metadataKey: FieldHandlerMetadata.KEY,
      })
      .forEach((value) => {
        const def = this.reflector.get(
          FieldHandlerMetadata.KEY,
          value.metatype!,
        );
        this.logger.log(`Successfully registered ${def}`);
        this.map.set(def, value.instance);
      });
  }
  getProvider(field: string) {
    return this.map.get(field);
  }
  call(field: string, accountID: AccountId) {
    const provider = this.getProvider(field);
    if (!provider) {
      return Promise.resolve(err(new UnknownField(field)));
    }
    return provider.provide({ accountID });
  }
}
