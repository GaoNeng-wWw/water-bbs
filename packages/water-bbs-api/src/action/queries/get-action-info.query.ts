import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Action } from 'water-bbs-migration';
import { DomainError, err, ok, Result } from 'water-bbs-shared';
import z from 'zod';
import { ActionInfo } from '../entity/action-info';

export class GetActionInfoQuery extends Query<Result<ActionInfo, DomainError>> {
  constructor(public readonly id: string) {
    super();
  }
}
@QueryHandler(GetActionInfoQuery)
export class GetActionInfoQueryHandler implements IQueryHandler<GetActionInfoQuery> {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: EntityRepository<Action>,
  ) {}
  async execute(
    query: GetActionInfoQuery,
  ): Promise<Result<ActionInfo, DomainError>> {
    const action = await this.actionRepository.findOne({ id: query.id });
    if (!action) {
      return err(new DomainError('ACTION_NOT_FOUND'));
    }
    const schema = z.fromJSONSchema(action.schema);
    return ok(new ActionInfo(action.name, schema));
  }
}
