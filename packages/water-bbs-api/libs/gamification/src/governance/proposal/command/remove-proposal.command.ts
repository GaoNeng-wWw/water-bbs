import { DomainError } from '@app/shared';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Proposal, ProposalId } from '../proposal.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ProposalNotFound } from '../error';

export class RemoveProposal extends Command<Result<void, DomainError>> {
  constructor(public readonly proposalId: ProposalId) {
    super();
  }
}

@CommandHandler(RemoveProposal)
export class RemoveProposalService implements ICommandHandler<RemoveProposal> {
  constructor(
    @InjectRepository(Proposal)
    private readonly repo: EntityRepository<Proposal>,
  ) {}
  async execute({
    proposalId,
  }: RemoveProposal): Promise<Result<void, DomainError>> {
    const proposal = await this.repo.findOne({ id: proposalId });
    if (!proposal) {
      return err(new ProposalNotFound());
    }
    const cancelResult = proposal.cancel();
    if (cancelResult.isErr()) {
      return cancelResult;
    }
    await this.repo.upsert(proposal);
    return ok();
  }
}
