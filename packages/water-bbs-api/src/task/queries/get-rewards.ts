import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DomainError, isErr, ok, Result } from 'water-bbs-shared';
import { RewardSummary } from '../dto';
import { RewardRegistry } from '@app/gamification';
import z from 'zod';

export class GetRewardsQuery extends Query<
  Result<RewardSummary[], DomainError>
> {
  constructor() {
    super();
  }
}

@QueryHandler(GetRewardsQuery)
export class GetRewards implements IQueryHandler<GetRewardsQuery> {
  constructor(private readonly rewardResgitry: RewardRegistry) {}
  execute(): Promise<Result<RewardSummary[], DomainError>> {
    const getRewardHandlersResult = this.rewardResgitry.getRewardHandlers();
    if (isErr(getRewardHandlersResult)) {
      return getRewardHandlersResult;
    }
    const handlers = getRewardHandlersResult.value;
    const summaries = handlers.map<RewardSummary>((handler) => {
      return {
        code: handler.code,
        description: handler.description,
        label: handler.label,
        schema: z.toJSONSchema(handler.schema),
      };
    });
    return Promise.resolve(ok(summaries));
  }
}
