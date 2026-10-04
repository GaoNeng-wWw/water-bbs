import { AccountId, Profile } from 'src/auth';
import { Field, FieldProvider } from '../fields.decorator';
import { ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';

@Field('user.profile.bio')
export class UserProfileBio implements FieldProvider<
  { accountID: AccountId },
  string | undefined
> {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: EntityRepository<Profile>,
  ) {}

  async provide(param: {
    accountID: AccountId;
  }): Promise<Result<string | undefined, DomainError>> {
    const profile = await this.repo.findOne({ accountId: param.accountID });

    return ok(profile?.bio);
  }
}