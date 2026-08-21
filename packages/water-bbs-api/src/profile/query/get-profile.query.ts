import { DomainError } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { ProfileInfo } from '../dto/get-profile.dto';

import { AccountId, Profile } from '../../auth';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserNotExists } from 'src/auth/errors';
import { isEmpty } from 'radashi';

export class GetProfileQuery extends Query<Result<ProfileInfo, DomainError>> {
  constructor(public readonly id: AccountId) {
    super();
  }
}

@QueryHandler(GetProfileQuery)
export class GetProfileService implements IQueryHandler<GetProfileQuery> {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: EntityRepository<Profile>,
  ) {}
  async execute(
    query: GetProfileQuery,
  ): Promise<Result<ProfileInfo, DomainError>> {
    const profile = await this.profileRepo.findOne({
      accountId: query.id,
    });
    if (isEmpty(profile) || !profile) {
      return err(new UserNotExists());
    }
    return ok({
      id: profile.accountId,
      nick: profile.nick,
      bio: profile.bio,
    });
  }
}
