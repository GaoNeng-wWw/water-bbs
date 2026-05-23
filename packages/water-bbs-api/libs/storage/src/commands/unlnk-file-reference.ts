import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileReference } from 'water-bbs-migration';
import { DomainError, err, isErr, ok, Result } from 'water-bbs-shared';
import {
  InjectStoreEngine,
  RemoveFileFail,
  type StorageEngine,
} from '../domain';

export class UnlinkFileReference extends Command<Result<boolean, DomainError>> {
  constructor(public fileRef: FileReference) {
    super();
  }
}

@CommandHandler(UnlinkFileReference)
export class UnlinkFileReferenceHandler implements ICommandHandler<UnlinkFileReference> {
  constructor(
    @InjectStoreEngine()
    private readonly storage: StorageEngine[],
  ) {}
  async execute(
    command: UnlinkFileReference,
  ): Promise<Result<boolean, DomainError>> {
    const fileRef = command.fileRef;
    const engine = this.storage.filter((s) => s.support(fileRef));
    const removeResults = await Promise.all(
      engine.map((engine) => engine.remove(fileRef)),
    );
    for (const res of removeResults) {
      if (isErr(res)) {
        return err(new RemoveFileFail(res.error));
      }
    }
    return ok(true);
  }
}
