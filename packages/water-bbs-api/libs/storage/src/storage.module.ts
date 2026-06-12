import { Module } from '@nestjs/common';
import { UnlinkFileReferenceHandler, LinkFileCommandHandler } from './commands';
import { STORAGE_ENGINE_KEY, URL_RESOLVER_KEY } from './domain';
import { LocalStorage, UrlResolver } from './infra';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FileReference } from 'water-bbs-migration';

@Module({
  imports: [MikroOrmModule.forFeature([FileReference])],
  providers: [
    LocalStorage,
    UrlResolver,
    UnlinkFileReferenceHandler,
    LinkFileCommandHandler,
    {
      provide: STORAGE_ENGINE_KEY,
      useFactory: (...deps) => deps as [LocalStorage],
      inject: [LocalStorage],
    },
    {
      provide: URL_RESOLVER_KEY,
      useClass: UrlResolver,
    },
  ],
  exports: [STORAGE_ENGINE_KEY, URL_RESOLVER_KEY],
})
export class StorageModule {}
