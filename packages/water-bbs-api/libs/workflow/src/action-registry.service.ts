import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, ModuleRef, Reflector } from '@nestjs/core';
import { ActionHandlerKey } from './action-handler.decorator';
import { IActionHandler } from './domain';

@Injectable()
export class ActionRegistryService implements OnApplicationBootstrap {
  private readonly logger = new Logger();
  private handlers: IActionHandler<unknown>[] = [];
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
    private readonly discoveryService: DiscoveryService,
  ) {}

  onApplicationBootstrap() {
    const metaTypes = this.discoveryService
      .getProviders()
      .filter(
        (provider) =>
          provider.metatype &&
          this.reflector.get(ActionHandlerKey, provider.metatype),
      )
      .map((instance) => instance.metatype);
    const handlers = metaTypes
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .map((mt) => (mt ? this.moduleRef.get(mt, { strict: false }) : false))
      .filter(Boolean);
    this.handlers = handlers;
  }

  getHandlers() {
    return this.handlers;
  }
  getHandler(name: string) {
    return this.handlers.filter((h) => h.type === name);
  }
}
