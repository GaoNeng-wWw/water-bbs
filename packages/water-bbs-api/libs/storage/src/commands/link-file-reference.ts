import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileReference } from 'water-bbs-migration';
import { DomainError, ok, Result } from 'water-bbs-shared';

export class LinkFileCommand extends Command<Result<boolean, DomainError>> {
  constructor(public fileRef: FileReference) {
    super();
  }
}

@CommandHandler(LinkFileCommand)
export class LinkFileCommandHandler implements ICommandHandler<LinkFileCommand> {
  constructor(
    @InjectRepository(FileReference)
    private readonly repo: EntityRepository<FileReference>,
  ) {}
  async execute(
    command: LinkFileCommand,
  ): Promise<Result<boolean, DomainError>> {
    await this.repo.upsert(command.fileRef);
    return ok(true);
  }
}
