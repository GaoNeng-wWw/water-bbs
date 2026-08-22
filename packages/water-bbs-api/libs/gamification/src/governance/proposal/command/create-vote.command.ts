import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  getSlot,
  ProposalId,
  ProposalSlot,
  Vote,
  VoteId,
  VoteKind,
} from '../proposal.entity';
import { ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { AccountId } from 'src/auth';

export class CreateVote extends Command<Result<VoteId, DomainError>> {
  constructor(
    public readonly proposalId: ProposalId,
    public readonly agree: boolean,
    public readonly accountId: AccountId,
  ) {
    super();
  }
}

@CommandHandler(CreateVote)
export class CreateVoteService implements ICommandHandler<CreateVote> {
  constructor(
    @InjectRepository(ProposalSlot)
    private readonly proposalSlotRepository: EntityRepository<ProposalSlot>,
    @InjectRepository(Vote)
    private readonly voteRepository: EntityRepository<Vote>,
  ) {}
  async execute({
    proposalId,
    agree,
    accountId,
  }: CreateVote): Promise<Result<VoteId, DomainError>> {
    const slot = getSlot(`${proposalId}:${accountId}`, 64);
    const em = this.proposalSlotRepository.getEntityManager();
    const vote = this.voteRepository.create({
      accountId,
      proposalId,
      slotId: slot,
      kind: agree ? VoteKind.Agree : VoteKind.Disagree,
    });
    await em.transactional(async (em) => {
      em.persist(vote);
      if (agree) {
        await em.getConnection().execute(
          `UPDATE proposal_slot 
        SET agree_count = agree_count + 1 
        WHERE proposal_id = ? AND slot_id = ?`,
          [proposalId, slot],
        );
      } else {
        await em.getConnection().execute(
          `UPDATE proposal_slot 
        SET disagree_count = disagree_count + 1 
        WHERE proposal_id = ? AND slot_id = ?`,
          [proposalId, slot],
        );
      }
    });

    return ok(vote.id);
  }
}
