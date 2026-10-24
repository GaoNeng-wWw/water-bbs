import { ConfigureService } from '@app/configure';
import { ApplicationError } from '@app/shared';
import { InjectStorage, type Storage } from '@app/storage';
import { EntityManager } from '@mikro-orm/core';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, Result } from 'neverthrow';
import { AccountId, Profile } from 'src/auth';
import { UserNotExists } from 'src/auth/errors';

export class UploadAvatar extends Command<
  Result<string, ApplicationError>
> {
  constructor(
    public readonly accountID: AccountId,
    public readonly file: Express.Multer.File,
  ) {
    super();
  }
}

@CommandHandler(UploadAvatar)
export class UploadAvatarService implements ICommandHandler<UploadAvatar> {
  constructor(
    @InjectStorage()
    public readonly storage: Storage,
    public readonly em: EntityManager,
    public readonly cfg: ConfigureService,
  ) {}
  async execute(
    command: UploadAvatar,
  ): Promise<Result<string, ApplicationError>> {
    const { accountID, file } = command;
    const profile = await this.em.findOne(Profile, { accountId: accountID });
    if (!profile) {
      return err(new UserNotExists());
    }
    const putResult = await this.storage.put(file);
    await this.em.transactional(async (tx) => {
      if (putResult.isErr()) {
        throw putResult.error;
      }
      profile.avatar = putResult.value.key;
      tx.persist(profile);
      await tx.flush();
    });

    return putResult.map((t) => t.key);
  }
}
