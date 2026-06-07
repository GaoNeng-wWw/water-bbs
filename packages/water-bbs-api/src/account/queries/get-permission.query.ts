import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Account } from 'water-bbs-migration';
import { AppError, err, ok, Result } from 'water-bbs-shared';
import { AccountNotFound } from '../application/errors';

export class GetPermissionQuery extends Query<Result<string[], AppError>> {
  constructor(public readonly accountID: string) {
    super();
  }
}

@QueryHandler(GetPermissionQuery)
export class GetPermissionHandler implements IQueryHandler<GetPermissionQuery> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: EntityRepository<Account>,
  ) {}
  async execute(
    query: GetPermissionQuery,
  ): Promise<Result<string[], AppError>> {
    const account = await this.accountRepository.findOne(query.accountID, {
      populate: ['role.permissions'],
    });
    if (!account) {
      return err(new AccountNotFound());
    }
    if (!account.role) {
      return ok([]);
    }
    return ok(account.role.permissions.map((p) => p.code));
  }
}
