import { IAction, WorkflowRunner } from '@app/workflow';
import { Proposals, ProposalStatus } from 'water-bbs-migration';
import { err, isErr, ok } from 'water-bbs-shared';

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
      return err(runRes.error);
    }
    const actions: IAction[] = JSON.parse(proposal.command);
    for (const action of actions) {
      const executeRes = await this.workflowRunner.execute<T>(action);
      if (isErr(executeRes)) {
        return err(executeRes.error);
      }
    }
    return ok(true);
  }
}
