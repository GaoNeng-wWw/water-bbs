import {
  ConfigurableModuleBuilder,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { ZodType } from 'zod';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import { ActionHandlerKey } from './action-handler.decorator';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Action } from 'water-bbs-migration';
import { WorkflowRunner } from './domain';
import { ActionRegistryService } from './action-registry.service';

export interface WorkflowOptions {
  onDisocver(name: string, schema?: ZodType): Promise<any>;
}

export const { MODULE_OPTIONS_TOKEN, ConfigurableModuleClass } =
  new ConfigurableModuleBuilder<WorkflowOptions>()
    .setClassMethodName('forRoot')
    .build();

@Module({
  imports: [DiscoveryModule, MikroOrmModule.forFeature([Action])],
  providers: [WorkflowService, WorkflowRunner, ActionRegistryService],
  exports: [WorkflowService, WorkflowRunner],
})
export class WorkflowModule
  extends ConfigurableModuleClass
  implements OnModuleInit
{
  private readonly logger = new Logger('Workflow');
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: WorkflowOptions,
  ) {
    super();
  }
  async onModuleInit() {
    const providers = this.discoveryService.getProviders();
    for (const provider of providers) {
      const { metatype, instance } = provider;
      if (metatype && this.reflector.get(ActionHandlerKey, metatype)) {
        this.logger.log(`Discovered ${metatype.name}`);
        await this.options.onDisocver(metatype.name, instance['schema']);
      }
    }
  }
}
