import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  getSlot,
  Proposal,
  ProposalId,
  ProposalSlot,
  Vote,
  VoteId,
  VoteKind,
} from '../proposal.entity';
import { err, ok, Result } from 'neverthrow';
import { DomainError, InternalError } from '@app/shared';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import {
  EntityManager,
  UniqueConstraintViolationException,
} from '@mikro-orm/sqlite';
import { AccountId } from 'src/auth';
import { ProposalNotFound, ProposalCannotVote, DuplicateVote } from '../error';

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
    @InjectRepository(Proposal)
    private readonly proposalRepository: EntityRepository<Proposal>,

    @InjectRepository(ProposalSlot)
    private readonly proposalSlotRepository: EntityRepository<ProposalSlot>,

    @InjectRepository(Vote)
    private readonly voteRepository: EntityRepository<Vote>,

    private readonly em: EntityManager,
  ) {}

  async execute({
    proposalId,
    agree,
    accountId,
  }: CreateVote): Promise<Result<VoteId, DomainError>> {
    try {
      const voteId = await this.em.transactional(async (tx) => {
        const proposal = await tx.findOne(Proposal, {
          id: proposalId,
        });

        if (!proposal) {
          throw new ProposalNotFound();
        }

        if (!proposal.canVote()) {
          throw new ProposalCannotVote();
        }
        const slot = getSlot(`${proposalId}:${accountId}`, 64);
        const vote = tx.create(Vote, {
          accountId,
          proposalId,
          slotId: slot,
          kind: agree ? VoteKind.Agree : VoteKind.Disagree,
        });

        tx.persist(vote);
        await tx.execute(
          agree
            ? `
              UPDATE proposal_slot
              SET agree_count = agree_count + 1
              WHERE proposal_id = ?
              AND slot_id = ?
            `
            : `
              UPDATE proposal_slot
              SET disagree_count = disagree_count + 1
              WHERE proposal_id = ?
              AND slot_id = ?
            `,
          [proposalId, slot],
          'run',
        );
        await tx.flush();

        return vote.id;
      });
      return ok(voteId);
    } catch (reason) {
      if (reason instanceof ProposalNotFound) {
        return err(reason);
      }

      if (reason instanceof ProposalCannotVote) {
        return err(reason);
      }

      if (reason instanceof UniqueConstraintViolationException) {
        return err(new DuplicateVote());
      }

      return err(new InternalError(reason));
    }
  }
}
