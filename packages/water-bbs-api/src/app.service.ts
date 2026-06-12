import { Configure } from '@app/configure';
import { InjectStoreEngine, StorageEngine } from '@app/storage';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileReference } from 'water-bbs-migration';
import { isErr, ok } from 'water-bbs-shared';

@Injectable()
export class AppSerivce {
  constructor(
    @InjectStoreEngine()
    private readonly storage: StorageEngine[],
    private config: ConfigService<Configure>,
    @InjectRepository(FileReference)
    private readonly fileReferenceRepo: EntityRepository<FileReference>,
  ) {}

  async getAsset(id: string) {
    const storageType = this.config.get('storage').type;
    const [engine] = this.storage.filter((s) => s.valid(storageType));
    if (!engine) {
      // TODO: UNSUPPORTED STORAGE ENGINE
    }
    const [asset] = await this.fileReferenceRepo.find({ storageKey: id });
    if (!asset) {
      throw new HttpException('ASSERT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    const data = await engine.load(asset);
    if (isErr(data)) {
      return data;
    }
    return ok({ data, asset });
  }
}
