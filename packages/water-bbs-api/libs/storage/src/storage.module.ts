import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigureModule, ConfigureService } from '@app/configure';
import { FileStrategy } from './application/strategy/file.strategy';
import { MemoryStrategy } from './application/strategy/memory.strategy';
import { StorageProvider } from './application/strategy/storage.provider';
import { UnknownStorageStrategy } from './application/error';
import { STORAGE_CONFIG_KEY, StorageConfig } from './constant';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Module({
  imports: [ConfigureModule],
  providers: [
    FileStrategy,
    MemoryStrategy,
    {
      provide: StorageProvider,
      inject: [ConfigureService, FileStrategy, MemoryStrategy],
      useFactory(
        config: ConfigureService,
        disk: FileStrategy,
        memory: MemoryStrategy,
      ) {
        switch (config.get('storage').kind) {
          case 'disk':
            return disk;
          case 'memory':
            return memory;
          default:
            throw new UnknownStorageStrategy();
        }
      },
    },
  ],
  exports: [StorageProvider],
})
export class StorageModule {
  private static logger: Logger = new Logger(StorageModule.name);
  static register(props: StorageConfig): DynamicModule {
    const base = join(__dirname, props.id);
    if (!existsSync(base)) {
      StorageModule.logger.log(`New storage directory created: ${base}`);
      mkdirSync(base);
    }
    StorageModule.logger.log(`Storage ${props.id} load success`);
    return {
      module: StorageModule,
      providers: [
        {
          provide: STORAGE_CONFIG_KEY,
          useValue: props,
        },
      ],
    };
  }
}
