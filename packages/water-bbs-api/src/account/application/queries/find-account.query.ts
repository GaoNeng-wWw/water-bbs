import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import {
  DomainError,
  err,
  isErr,
  ok,
  Result,
  unwrapErr,
} from 'water-bbs-shared';
import { AccountID } from '../../domain';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../../domain/repo/account.repo';
import { AccountNotFound } from '../errors/account-not-found';
import { PublicAccountInfo } from '../../domain/dto/public-account-info';

export class FindAccountQuery extends Query<
  Result<PublicAccountInfo, DomainError>
> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(FindAccountQuery)
export class FindAccountQueryHandler implements IQueryHandler<FindAccountQuery> {
  constructor(
    @InjectAccountRepository()
    private accountRepository: IAccountRepoistory,
  ) {}

  async execute(
    query: FindAccountQuery,
  ): Promise<Result<PublicAccountInfo, DomainError>> {
    const accountId = new AccountID({ value: query.id });
    const res = await this.accountRepository.findOne(accountId);
    if (isErr(res)) {
      return err(unwrapErr(res));
    }
    const account = res.value;
    if (!account) {
      return err(new AccountNotFound());
    }
    return ok(
      new PublicAccountInfo(
        account.id,
        account.profile.name,
        account.profile.bio,
      ),
    );
  }
}
