import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Action } from 'water-bbs-migration';
import { DomainError, ok, Result } from 'water-bbs-shared';
import { ActionList } from '../entity/action-list';
import { ActionInfo } from '../entity/action-info';

export class ListAction extends Query<Result<ActionList, DomainError>> {
  constructor() {
    super();
  }
}

@QueryHandler(ListAction)
export class ListActionQueryHandler implements IQueryHandler<ListAction> {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: EntityRepository<Action>,
  ) {}
  async execute(): Promise<Result<ActionList, DomainError>> {
    return this.actionRepository
      .findAll({})
      .then((items) => {
        return items.map((item) => new ActionInfo(item.name, item.schema));
      })
      .then((items) => new ActionList(items))
      .then(ok);
  }
}
