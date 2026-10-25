import { ApplicationError } from '@app/shared';
import { InjectStorage, StorageKey, type Storage } from '@app/storage';
import { EntityManager } from '@mikro-orm/core';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { AccountId, Profile } from 'src/auth';
import { UserNotExists } from 'src/auth/errors';

export class GetAvatar extends Query<Result<Buffer, ApplicationError>> {
  constructor(public readonly accountId: AccountId) {
    super();
  }
}

@QueryHandler(GetAvatar)
export class GetAvatarService implements IQueryHandler<GetAvatar> {
  constructor(
    @InjectStorage('avatar')
    public readonly storage: Storage<Express.Multer.File, Buffer>,
    public readonly em: EntityManager,
  ) {}
  async execute({
    accountId,
  }: GetAvatar): Promise<Result<Buffer, ApplicationError>> {
    const profile = await this.em.findOne(Profile, { accountId });
    if (!profile) {
      return err(new UserNotExists());
    }
    if (!profile.avatar) {
      return ok(Buffer.from([]));
    }
    return (await this.storage.read(profile.avatar as StorageKey)).map((t) => {
      return t.payload;
    });
  }
}