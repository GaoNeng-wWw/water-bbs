import { Module } from '@nestjs/common';
import { ConfigureModule, ConfigureService } from '@app/configure';
import { FileStrategy } from './application/strategy/file.strategy';
import { MemoryStrategy } from './application/strategy/memory.strategy';
import { StorageProvider } from './application/strategy/storage.provider';
import { UnknownStorageStrategy } from './application/error';

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
export class StorageModule {}
