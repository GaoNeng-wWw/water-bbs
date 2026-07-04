import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { DiscoveryService, ModuleRef, Reflector } from '@nestjs/core';
import { IFactHandler, FactKey, FactMetadata } from './fact.type';
import { isNullish } from 'radashi';
import { Engine, Fact } from 'json-rules-engine';

@Injectable()
export class FactFactory implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(FactFactory.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
    private readonly discoveryService: DiscoveryService,
    @Inject('ENGINE')
    private readonly engine: Engine,
  ) {}
  onApplicationBootstrap() {
    const metatypes = this.discoveryService
      .getProviders()
      .filter(
        (instance) =>
          instance.metatype && this.reflector.get(FactKey, instance.metatype),
      )
      .map((instance) => instance.metatype)
      .filter((mt) => !isNullish(mt));
    const handlers = metatypes.map((mt) => {
      const factMetadata = this.reflector.get<FactMetadata>(FactKey, mt);
      return {
        handler: this.moduleRef.get<IFactHandler>(mt, { strict: false }),
        name: factMetadata.name,
      };
    });
    handlers.forEach((handler) => {
      this.engine.addFact(
        new Fact(handler.name, (params, almanac) =>
          handler.handler.getFact(params, almanac),
        ),
      );
      this.logger.log(`Resgiter fact ${handler.name} successed!`);
    });
  }
}
