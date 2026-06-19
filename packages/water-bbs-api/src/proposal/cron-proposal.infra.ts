import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExecuteProposalCommand } from './command';
import { FindAllActiveProposalQuery } from './queries';
import { isErr, ok } from 'water-bbs-shared';
import { GetVoteCountQuery } from '../vote/queries';

@Injectable()
export class CronProposalRunner {
  private readonly logger = new Logger();
  constructor(
    private readonly qb: QueryBus,
    private readonly cb: CommandBus,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async run() {
    const proposals = await this.qb.execute(new FindAllActiveProposalQuery());
    if (isErr(proposals)) {
      this.logger.error(proposals.error);
      return proposals;
    }
    for (const proposal of proposals.value) {
      const voteTotal = await this.qb.execute(
        new GetVoteCountQuery(proposal.id),
      );
      if (isErr(voteTotal)) {
        this.logger.error(voteTotal.error);
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
        this.logger.error(runRes.error);
        return runRes;
      }
    }
    return ok(null);
  }
}
