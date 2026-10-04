import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { AccountId } from '../../entites/auth';
import { err, ok, Result } from 'neverthrow';
import { DomainError, InternalError } from '@app/shared';
import { RedisSessionRepository } from '../../infra';

export class Online extends Query<Result<boolean, DomainError>> {
  constructor(public readonly accountID: AccountId) {
    super();
  }
}

@QueryHandler(Online)
export class OnlineService implements IQueryHandler<Online> {
  constructor(private readonly sessionRepository: RedisSessionRepository) {}
  async execute({ accountID }: Online): Promise<Result<boolean, DomainError>> {
    const sessionCount = await this.sessionRepository
      .countSessionById(accountID)
      .then((count) => ok(count > 0))
      .catch((reason) => err(new InternalError(reason)));
    return sessionCount;
  }
}
