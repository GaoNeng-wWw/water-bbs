import { ApplicationError } from '@app/shared';
import { InjectStorage, toStorageKey, type Storage } from '@app/storage';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';

export class PersistenceImageCommand extends Command<
  Result<void, ApplicationError>
> {
  constructor(public readonly keys: string[]) {
    super();
  }
}

@CommandHandler(PersistenceImageCommand)
export class PersistenceImage implements ICommandHandler<PersistenceImageCommand> {
  constructor(
    @InjectStorage('topic-image')
    private readonly storage: Storage,
  ) {}
  async execute(
    command: PersistenceImageCommand,
  ): Promise<Result<void, ApplicationError>> {
    const { keys } = command;
    const results = await Promise.all(
      keys.map((key) => this.storage.persistence(toStorageKey(key))),
    );
    const errors = results.filter((item) => item.isErr());
    if (errors.length > 0) {
      return err(errors[0].error);
    }
    return ok();
  }
}