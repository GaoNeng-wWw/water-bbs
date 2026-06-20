import { Configure } from '@app/configure';
import {
  InjectStoreEngine,
  InjectUrlResolver,
  StorageEngine,
  UnsupportedStorageEngine,
  UrlResolver,
} from '@app/storage';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileReference, Resource } from 'water-bbs-migration';
import { DomainError, err, isErr, ok, Result } from 'water-bbs-shared';

export type UploadFileResult = { url: string };

export class UploadFileCommand extends Command<
  Result<UploadFileResult, DomainError>
> {
  constructor(
    public readonly file: Express.Multer.File,
    public readonly cost: number = 0,
    public readonly subject: string,
  ) {
    super();
  }
}

@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler implements ICommandHandler<UploadFileCommand> {
  async execute(
    command: UploadFileCommand,
  ): Promise<Result<UploadFileResult, DomainError>> {
    const { file, cost, subject } = command;
    const storagePolicy = this.config.get('storage').type;
    const [engine] = this.storage.filter((s) => s.valid(storagePolicy));
    if (!engine) {
      return err(new UnsupportedStorageEngine());
    }
    const putRes = await engine.put(
      file.buffer,
      file.mimetype,
      file.filename,
      file.size,
    );
    if (isErr(putRes)) {
      return putRes;
    }
    await this.em.transactional(async (em) => {
      const fileRef = await this.fileReferenceRepo.upsert(putRes.value, { em });
      const resource = Resource.build(cost, subject, fileRef.storageKey);
      await this.resourceRepo.upsert(resource, { em });
    });
    const url = await this.urlResolver.getUrl(putRes.value);
    if (isErr(url)) {
      return url;
    }
    return ok({ url: url.value });
  }
  constructor(
    @InjectUrlResolver()
    private urlResolver: UrlResolver,
    @InjectStoreEngine()
    private readonly storage: StorageEngine[],
    private readonly config: ConfigService<Configure, true>,
    @InjectRepository(FileReference)
    private readonly fileReferenceRepo: EntityRepository<FileReference>,
    @InjectRepository(Resource)
    private readonly resourceRepo: EntityRepository<Resource>,
    private readonly em: EntityManager,
  ) {}
}
