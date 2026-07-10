import { FactRegistry } from '@app/gamification';
import { IQueryHandler, Query } from '@nestjs/cqrs';
import { DomainError, ok, Result } from 'water-bbs-shared';
import { FactInfo } from '../dto/get-fact.dto';

export class GetFactsQuery extends Query<Result<FactInfo[], DomainError>> {
  constructor() {
    super();
  }
}

export class GetFact implements IQueryHandler<GetFactsQuery> {
  constructor(private factRegistry: FactRegistry) {}
  execute(): Result<FactInfo[], DomainError> {
    const facts = this.factRegistry.getFacts();
    const infos = facts.map<FactInfo>((fact) => {
      return {
        name: fact.name,
        returnType: fact.returnType,
      };
    });
    return Promise.resolve(ok(infos));
  }
}
