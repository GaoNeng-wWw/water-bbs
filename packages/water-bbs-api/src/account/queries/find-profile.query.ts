import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { AppError, err, isErr, ok, Result } from 'water-bbs-shared';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../domain/repo/account.repo';
import { AccountID } from '../domain';
import { AccountNotFound } from '../application/errors';
import { InjectUrlResolver, type Resolver } from '@app/storage';

export class FindProfileByAccountIDQuery extends Query<
  Result<{ id: string; nick: string; bio?: string; avatar?: string }, AppError>
> {
  constructor(public accountID: string) {
    super();
  }
}

@QueryHandler(FindProfileByAccountIDQuery)
export class FindProfileHandler implements IQueryHandler<FindProfileByAccountIDQuery> {
  constructor(
    @InjectAccountRepository()
    private repo: IAccountRepoistory,
    @InjectUrlResolver()
    private resolver: Resolver,
  ) {}
  async execute(
    query: FindProfileByAccountIDQuery,
  ): Promise<
    Result<
      { id: string; nick: string; bio?: string; avatar?: string },
      AppError
    >
  > {
    const findResult = await this.repo.findOne(
      new AccountID({ value: query.accountID }),
    );
    if (isErr(findResult)) {
      return findResult;
    }
    if (!findResult.value) {
      return err(new AccountNotFound());
    }
    const url = findResult.value.profile.avatar
      ? await this.resolver.getUrl(findResult.value.profile.avatar)
      : ok('');
    if (isErr(url)) {
      return url;
    }
    return ok({
      id: findResult.value.id,
      nick: findResult.value.profile.name,
      avatar: url.value,
      bio: findResult.value.profile.bio,
    });
  }
}
