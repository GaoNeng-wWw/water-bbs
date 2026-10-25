import { ApplicationError } from '@app/shared';
import { InjectStorage, type Storage } from '@app/storage';
import { Command, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';

export class UploadImageCommand extends Command<
  Result<string[], ApplicationError>
> {
  constructor(public readonly files: Express.Multer.File[]) {
    super();
  }
}

export class UploadImage implements ICommandHandler<UploadImageCommand> {
  constructor(
    @InjectStorage('topic-image')
    private readonly storage: Storage,
  ) {}
  async execute(
    command: UploadImageCommand,
  ): Promise<Result<string[], ApplicationError>> {
    const { files } = command;
    const entitiesResult = await Promise.all(
      files.map((file) => this.storage.put(file, false)),
    );
    const errors = entitiesResult.filter((item) => item.isErr());
    if (errors.length > 0) {
      return err(errors[0].error);
    }
    const keys = entitiesResult
      .filter((item) => item.isOk())
      .map((e) => e.value.key.toString());
    return ok(keys);
  }
}