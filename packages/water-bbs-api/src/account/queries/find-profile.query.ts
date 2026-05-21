import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { AppError, err, isErr, ok, Result } from 'water-bbs-shared';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../domain/repo/account.repo';
import { AccountID } from '../domain';
import { AccountNotFound } from '../application/errors';

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
    return ok({
      id: findResult.value.id,
      nick: findResult.value.profile.name,
      avatar: findResult.value.profile.avatar,
      bio: findResult.value.profile.bio,
    });
  }
}
