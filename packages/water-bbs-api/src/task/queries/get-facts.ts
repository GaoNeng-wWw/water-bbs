import { FactRegistry } from '@app/gamification';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DomainError, ok, Result } from 'water-bbs-shared';
import { FactInfo } from '../dto/get-fact.dto';

export class GetFactsQuery extends Query<Result<FactInfo[], DomainError>> {
  constructor() {
    super();
  }
}

@QueryHandler(GetFactsQuery)
export class GetFact implements IQueryHandler<GetFactsQuery> {
  constructor(private factRegistry: FactRegistry) {}
  execute(): Promise<Result<FactInfo[], DomainError>> {
    const facts = this.factRegistry.getFacts();
    const infos = facts.map<FactInfo>((fact) => {
      return {
        name: fact.name,
        returnType: fact.returnType
      };
    });
    return Promise.resolve(ok(infos));
  }
}
