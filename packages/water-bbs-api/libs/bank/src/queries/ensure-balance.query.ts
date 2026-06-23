import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Wallet } from 'water-bbs-migration';
import Decimal from 'decimal.js';
import { DomainError, err, ok, Result } from 'water-bbs-shared';

export class EnsureBalanceQuery extends Query<Result<true, DomainError>> {
  constructor(
    public subject: string,
    public cost: number,
  ) {
    super();
  }
}

@QueryHandler(EnsureBalanceQuery)
export class EnsureBalanceHandler implements IQueryHandler<EnsureBalanceQuery> {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: EntityRepository<Wallet>,
  ) {}

  async execute(query: EnsureBalanceQuery): Promise<Result<true, DomainError>> {
    const wallet = await this.walletRepo.findOne(
      { accountId: query.subject },
      { fields: ['balance'], cache: true },
    );
    if (!wallet) {
      return err(
        new DomainError('WALLET_NOT_FOUND', null, {
          accountId: query.subject,
        }),
      );
    }
    if (new Decimal(wallet.balance).lt(query.cost)) {
      return err(new DomainError('INSUFFICIENT_BALANCE'));
    }
    return ok(true);
  }
}
