import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Action } from 'water-bbs-migration';
import { DomainError, ok, Result } from 'water-bbs-shared';
import { ActionTotal } from '../entity/action-total';

export class GetActionTotalQuery extends Query<
  Result<ActionTotal, DomainError>
> {}

@QueryHandler(GetActionTotalQuery)
export class GetActionTotalQueryHandler implements IQueryHandler<GetActionTotalQuery> {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: EntityRepository<Action>,
  ) {}
  async execute(): Promise<Result<ActionTotal, DomainError>> {
    return this.actionRepository
      .count()
      .then((value) => new ActionTotal(value))
      .then(ok);
  }
}
