import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExecuteProposalCommand } from './command';
import { FindAllActiveProposalQuery } from './queries';
import { isErr, ok } from 'water-bbs-shared';
import { GetVoteCountQuery } from '../vote/queries';

@Injectable()
export class CronProposalRunner {
  constructor(
    private readonly qb: QueryBus,
    private readonly cb: CommandBus,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async run() {
    const proposals = await this.qb.execute(new FindAllActiveProposalQuery());
    if (isErr(proposals)) {
      return proposals;
    }
    for (const proposal of proposals.value) {
      const voteTotal = await this.qb.execute(
        new GetVoteCountQuery(proposal.id),
      );
      if (isErr(voteTotal)) {
        return voteTotal;
      }
      const runRes = await this.cb.execute(
        new ExecuteProposalCommand(
          proposal.id,
          voteTotal.value.yes,
          voteTotal.value.no,
        ),
      );
      if (isErr(runRes)) {
        return runRes;
      }
    }
    return ok(null);
  }
}
