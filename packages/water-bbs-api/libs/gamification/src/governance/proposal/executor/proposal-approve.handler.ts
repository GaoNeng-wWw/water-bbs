import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Approve } from '../events';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Proposal } from '../proposal.entity';
import { EntityRepository } from '@mikro-orm/sqlite';
import { err } from 'neverthrow';
import { ProposalNotFound } from '../error';
import { StepRunner } from '@app/engine';

@EventsHandler(Approve)
export class ProposalApprove implements IEventHandler<Approve> {
  constructor(
    @InjectRepository(Proposal)
    private readonly repo: EntityRepository<Proposal>,
    private readonly stepRunner: StepRunner,
  ) {}
  async handle(event: Approve) {
    const proposal = await this.repo.findOne({ id: event.proposalId });
    if (!proposal) {
      return err(new ProposalNotFound());
    }
    const updateStatusResult = proposal.executing();
    if (updateStatusResult.isErr()) {
      return updateStatusResult;
    }
    await this.repo.upsert(proposal);

    await this.repo.getEntityManager().transactional(async (em) => {
      const runTasks = proposal.steps.map((step) =>
        this.stepRunner.run(step.stepName, step.param, em),
      );
      const runResult = await Promise.all(runTasks);
      const err = runResult.find((r) => r.isErr());
      if (err) {
        throw err.error;
      }
      const doneResult = proposal.executed();
      if (doneResult.isErr()) {
        throw doneResult.error;
      }
      await em.upsert(Proposal, proposal);
      return;
    });
  }
}
