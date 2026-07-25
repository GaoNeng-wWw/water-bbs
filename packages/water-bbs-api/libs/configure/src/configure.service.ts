import { Injectable } from '@nestjs/common';
import { ConfigService, Path, PathImpl2, PathValue } from '@nestjs/config';
import { Configure } from './configrue';

@Injectable()
export class ConfigureService {
  constructor(private cfg: ConfigService<Configure, true>) {}

  get<P extends PathImpl2<Configure> = Path<Configure>>(
    path: P,
  ): PathValue<Configure, P> {
    return this.cfg.get(path as any);
  }
}
