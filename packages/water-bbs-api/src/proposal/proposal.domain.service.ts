import { WorkflowRunner } from '@app/workflow';
import { Proposals, ProposalStatus } from 'water-bbs-migration';
import { isErr, ok } from 'water-bbs-shared';

export type VoteResult = { yes: number; no: number };

export class ProposalDomainService {
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
      return runRes;
    }
    const command = JSON.parse(proposal.command);
    const executeRes = await this.workflowRunner.execute<T>(command);
    const doneRes = proposal.done();
    if (isErr(doneRes)) {
      return doneRes;
    }
    if (isErr(executeRes)) {
      return executeRes;
    }
    return executeRes;
  }
}
