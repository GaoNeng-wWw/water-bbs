import { Module } from '@nestjs/common';
import { UnlinkFileReferenceHandler } from './commands/unlnk-file-reference';
import { STORAGE_ENGINE_KEY, URL_RESOLVER_KEY } from './domain';
import { LocalStorage, UrlResolver } from './infra';

@Module({
  providers: [
    LocalStorage,
    UrlResolver,
    UnlinkFileReferenceHandler,
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
