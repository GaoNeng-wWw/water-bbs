import { InjectUrlResolver, type Resolver } from '@app/storage';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../domain/repo/account.repo';
import { AccountID } from '../domain';

export class Profile {
  constructor(
    public id: string,
    public nick: string,
    public bio?: string,
    public avatar?: string,
  ) {}
}
export class FindProfileBatchQueryResponse {
  constructor(
    public id: string,
    public profile?: Profile,
  ) {}
}
export class FindProfileBatchQuery extends Query<
  Result<FindProfileBatchQueryResponse[], AppError>
> {
  constructor(public ids: string[]) {
    super();
  }
}

@QueryHandler(FindProfileBatchQuery)
export class FindProfileBatchQueryHandler implements IQueryHandler<FindProfileBatchQuery> {
  constructor(
    @InjectAccountRepository()
    private repo: IAccountRepoistory,
    @InjectUrlResolver()
    private resolver: Resolver,
  ) {}
  async execute(
    query: FindProfileBatchQuery,
  ): Promise<Result<FindProfileBatchQueryResponse[], AppError>> {
    const profiles: FindProfileBatchQueryResponse[] = [];
    for (const id of query.ids) {
      const resp = await this.repo.findOne(new AccountID({ value: id }));
      if (isErr(resp)) {
        return resp;
      }
      if (!resp.value) {
        profiles.push(new FindProfileBatchQueryResponse(id));
        continue;
      }
      const avatarRaw = resp.value.profile.avatar;
      if (!avatarRaw) {
        continue;
      }
      const avatar = await this.resolver.getUrl(avatarRaw);
      const avatrUrl = isErr(avatar) ? undefined : avatar.value;
      profiles.push(
        new FindProfileBatchQueryResponse(
          id,
          new Profile(
            resp.value.id,
            resp.value.profile.name,
            resp.value.profile.bio,
            avatrUrl,
          ),
        ),
      );
    }
    return ok(profiles);
  }
}
