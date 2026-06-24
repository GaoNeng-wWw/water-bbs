import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { isEmpty } from 'class-validator';
import { Wallet } from 'water-bbs-migration';
import { DomainError, err, ok, Result } from 'water-bbs-shared';

export class GetBalanceQuery extends Query<
  Result<{ balance: string }, DomainError>
> {
  constructor(public readonly accountId: string) {
    super();
  }
}

@QueryHandler(GetBalanceQuery)
export class GetBalance implements IQueryHandler<GetBalanceQuery> {
  async execute({
    accountId,
  }: GetBalanceQuery): Promise<Result<{ balance: string }, DomainError>> {
    const wallet = await this.repo.findOne(
      {
        accountId,
      },
      { fields: ['balance'], cache: true },
    );
    if (!wallet || isEmpty(wallet)) {
      return err(new DomainError('WALLET_NOT_FOUND', null, { accountId }));
    }
    return ok({ balance: wallet.balance });
  }
  constructor(
    @InjectRepository(Wallet)
    private readonly repo: EntityRepository<Wallet>,
  ) {}
}
