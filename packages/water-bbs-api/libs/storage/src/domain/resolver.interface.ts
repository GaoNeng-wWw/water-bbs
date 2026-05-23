import { Inject } from '@nestjs/common';
import { FileReference } from 'water-bbs-migration/file-ref';
import { InfrastructureError, Result } from 'water-bbs-shared';

export const URL_RESOLVER_KEY = Symbol('STORAGE.URL_RESOLVER');
export const InjectUrlResolver = () => Inject(URL_RESOLVER_KEY);

export interface Resolver {
  getUrl(ref: FileReference): Promise<Result<string, InfrastructureError>>;
}
