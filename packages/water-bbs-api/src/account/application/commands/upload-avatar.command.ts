import {
  Command,
  CommandBus,
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';
import { DomainError, err, isErr, ok, Result } from 'water-bbs-shared';
import { AccountID } from '../../domain';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../../domain/repo/account.repo';
import { AccountNotFound } from '../errors/account-not-found';
import {
  InjectStoreEngine,
  InjectUrlResolver,
  UnlinkFileReference,
  type Resolver,
  type StorageEngine,
} from '@app/storage';
import { UpdateAvatarResponse } from '../../domain/dto/update-avatar.dto';
import { ConfigService } from '@nestjs/config';
import { Configure } from '@app/configure';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { Profile } from 'water-bbs-migration';

export class UploadAvatarCommand extends Command<
  Result<UpdateAvatarResponse, DomainError>
> {
  constructor(
    public readonly accountId: string,
    public readonly avatar: Express.Multer.File,
  ) {
    super();
  }
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarCommandHandler implements ICommandHandler<UploadAvatarCommand> {
  constructor(
    @InjectAccountRepository()
    private accountRepository: IAccountRepoistory,
    private readonly commandPublisher: CommandBus,
    @InjectUrlResolver()
    private readonly fileUrlResolver: Resolver,
    @InjectStoreEngine()
    private readonly storage: StorageEngine[],
    @InjectRepository(Profile)
    private profileRepository: EntityRepository<Profile>,
    private config: ConfigService<Configure>,
  ) {}

  async execute(
    command: UploadAvatarCommand,
  ): Promise<Result<UpdateAvatarResponse, DomainError>> {
    const accountRes = await this.accountRepository.findOne(
      new AccountID({ value: command.accountId }),
    );
    if (isErr(accountRes)) {
      return accountRes;
    }
    const account = accountRes.value;
    if (!account) {
      return err(new AccountNotFound());
    }

    const storagePolicy = this.config.get('storage').type;
    const [engine] = this.storage.filter((s) => s.valid(storagePolicy));
    if (!engine) {
      // TODO: UNSUPPORTED STORAGE ENGINE
    }

    const putResult = await engine.put(
      command.avatar.buffer,
      command.avatar.mimetype,
      command.avatar.originalname || command.avatar.filename,
      command.avatar.size,
    );
    if (isErr(putResult)) {
      return putResult;
    }
    const fileRef = putResult.value;

    if (account.profile.avatar) {
      await this.commandPublisher.execute(
        new UnlinkFileReference(account.profile.avatar),
      );
    }

    account.profile.avatar = fileRef;
    await this.accountRepository.upsert(account);
    await this.profileRepository.upsert(account.profile);

    const urlResult = await this.fileUrlResolver.getUrl(account.profile.avatar);
    if (isErr(urlResult)) {
      return urlResult;
    }

    return ok(new UpdateAvatarResponse(urlResult.value));
  }
}
