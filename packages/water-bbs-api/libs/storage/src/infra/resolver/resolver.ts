import { Configure } from '@app/configure';
import { Resolver } from '@app/storage/domain';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileReference } from 'water-bbs-migration';
import { InfrastructureError, ok, Result } from 'water-bbs-shared';

@Injectable()
export class UrlResolver implements Resolver {
  constructor(private configure: ConfigService<Configure>) {}
  getUrl(ref: FileReference): Promise<Result<string, InfrastructureError>> {
    const hash = ref.name;
    return Promise.resolve(ok(`${this.configure.get('basePath')}/${hash}`));
  }
}
