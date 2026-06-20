import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import {
  InjectStoreEngine,
  InjectUrlResolver,
  UnsupportedStorageEngine,
  type Resolver,
  type StorageEngine,
} from '@app/storage';
import { Configure } from '@app/configure';
import { FileReference } from 'water-bbs-migration';
import { DomainError, err, isErr, ok, Result } from 'water-bbs-shared';
import sharp from 'sharp';

export type UploadImageResult = { url: string };

export class UploadImageCommand extends Command<
  Result<UploadImageResult, DomainError>
> {
  constructor(public readonly file: Express.Multer.File) {
    super();
  }
}

@CommandHandler(UploadImageCommand)
export class UploadImageCommandHandler implements ICommandHandler<UploadImageCommand> {
  constructor(
    @InjectUrlResolver()
    private readonly fileUrlResolver: Resolver,
    @InjectStoreEngine()
    private readonly storage: StorageEngine[],
    private readonly config: ConfigService<Configure>,
    @InjectRepository(FileReference)
    private readonly fileReferenceRepo: EntityRepository<FileReference>,
  ) {}
  async execute(
    command: UploadImageCommand,
  ): Promise<Result<UploadImageResult, DomainError>> {
    const storagePolicy = this.config.get('storage').type;
    const [engine] = this.storage.filter((s) => s.valid(storagePolicy));
    if (!engine) {
      return err(new UnsupportedStorageEngine());
    }
    const putResult = await engine.put(
      await sharp(command.file.buffer).webp().toBuffer(),
      command.file.mimetype,
      command.file.filename,
      command.file.size,
    );
    if (isErr(putResult)) {
      return putResult;
    }
    await this.fileReferenceRepo.upsert(putResult.value);
    const url = await this.fileUrlResolver.getUrl(putResult.value);
    if (isErr(url)) {
      return url;
    }
    return ok({ url: url.value });
  }
}
