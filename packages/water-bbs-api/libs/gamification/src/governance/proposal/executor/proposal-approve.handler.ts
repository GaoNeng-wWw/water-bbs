import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Approve } from '../events';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Proposal } from '../proposal.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/sqlite';
import { err } from 'neverthrow';
import { ProposalNotFound } from '../error';
import { StepRunner } from '@app/engine';

@EventsHandler(Approve)
export class ProposalApprove implements IEventHandler<Approve> {
  constructor(
    @InjectRepository(Proposal)
    private readonly repo: EntityRepository<Proposal>,
    private readonly em: EntityManager,
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
        const reason = err.error.toString();
        proposal.failed(reason);
        await this.repo.upsert(proposal);
        throw err.error;
      }
      const doneResult = proposal.executed();
      if (doneResult.isErr()) {
        const reason = doneResult.error.toString();
        proposal.failed(reason);
        await this.repo.upsert(proposal);
        throw doneResult.error;
      }
      await em.upsert(Proposal, proposal);
      return;
    });
  }
}
