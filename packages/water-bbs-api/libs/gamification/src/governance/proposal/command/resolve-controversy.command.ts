import { Command, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Proposal, ProposalId } from '../proposal.entity';
import { DomainError, PermissionDeniedError } from '@app/shared';
import { AccountId } from 'src/auth';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ProposalNotFound } from '../error';
import { GovernanceMember } from '../../member';
import { ProposalControversyResolvedEvent } from '../events';

export class ResolveControversy extends Command<
  Result<ProposalId, DomainError>
> {
  constructor(
    public readonly id: ProposalId,
    public readonly accountId: AccountId,
    public readonly approve: boolean,
  ) {
    super();
  }
}

export class ResolveControversyService implements ICommandHandler<ResolveControversy> {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: EntityRepository<Proposal>,
    @InjectRepository(GovernanceMember)
    private readonly memberRepository: EntityRepository<GovernanceMember>,
    private readonly eventBus: EventBus,
  ) {}
  async execute(
    command: ResolveControversy,
  ): Promise<Result<ProposalId, DomainError>> {
    const proposal = await this.proposalRepository.findOne({
      id: command.id,
    });

    if (!proposal) {
      return err(new ProposalNotFound());
    }

    const member = await this.memberRepository.findOne({
      accountId: command.accountId,
      $or: [{ endedAt: null }, { endedAt: { $gt: new Date() } }],
    });
    if (!member || !member.canResolveControversy()) {
      return err(new PermissionDeniedError());
    }
    if (command.approve) {
      const approveResult = proposal.approve();
      if (approveResult.isErr()) {
        return approveResult;
      }
    } else {
      const rejectResult = proposal.reject();
      if (rejectResult.isErr()) {
        return rejectResult;
      }
    }
    await this.proposalRepository.upsert(proposal);
    this.eventBus.publish(
      new ProposalControversyResolvedEvent(
        proposal.id,
        command.accountId,
        member.id,
        command.approve,
      ),
    );
    return ok(proposal.id);
  }
}
