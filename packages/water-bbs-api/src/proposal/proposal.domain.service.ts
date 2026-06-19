import { IAction, WorkflowRunner } from '@app/workflow';
import { Injectable, Logger } from '@nestjs/common';
import { Proposals, ProposalStatus } from 'water-bbs-migration';
import { err, isErr, ok } from 'water-bbs-shared';

export type VoteResult = { yes: number; no: number };

@Injectable()
export class ProposalDomainService {
  private readonly logger = new Logger();
  constructor(private workflowRunner: WorkflowRunner) {}
  canRun(proposal: Proposals, voteResult: VoteResult) {
    return (
      proposal.status === ProposalStatus.Active &&
      voteResult.yes > voteResult.no
    );
  }
  async run<T>(proposal: Proposals, yes: number, no: number) {
    if (!this.canRun(proposal, { yes, no })) {
      proposal.reject();
      return ok(true);
    }
    const runRes = proposal.run();
    if (isErr(runRes)) {
      return err(runRes.error);
    }
    const actions: IAction[] = JSON.parse(proposal.command);
    this.logger.log(`${proposal.id} start`);
    for (const action of actions) {
      this.logger.log(`${action.type} Running`);
      const executeRes = await this.workflowRunner.execute<T>(
        action,
        action.args,
      );
      if (isErr(executeRes)) {
        this.logger.error(executeRes.error);
        return err(executeRes.error);
      }
      this.logger.log(`${action.type} Done`);
    }
    this.logger.log(`${proposal.id} done`);
    return ok(true);
  }
}
