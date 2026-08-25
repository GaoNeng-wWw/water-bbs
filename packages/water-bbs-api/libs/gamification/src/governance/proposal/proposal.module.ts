import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import {
  Proposal,
  ProposalId,
  ProposalSlot,
  ProposalStatus,
  Vote,
} from './proposal.entity';
import {
  CreateProposal,
  CreateVoteService,
  RemoveProposal,
  ResolveControversyService,
} from './command';
import {
  CalculateVote,
  CalculateVoteService,
  CountAccountVoteService,
  FindProposalService,
  FindVoteByCreatorService,
  ListProposalService,
} from './query';
import { Cron, CronExpression } from '@nestjs/schedule';
import {} from 'cron';
import { EntityRepository } from '@mikro-orm/sqlite';
import { EventBus, IEvent, QueryBus } from '@nestjs/cqrs';
import { Approve, Controversy, Reject } from './events';
import { ProposalNotFound } from './error';
import { ProposalApprove, OnEmergencyProposalCreated } from './executor';
import { EngineModule } from '@app/engine';
import { OnProposalControversyResolved } from './event-handler';
import { GovernanceMember } from '../member';

@Module({
  imports: [
    MikroOrmModule.forFeature([Proposal, Vote, ProposalSlot, GovernanceMember]),
    EngineModule,
  ],
  providers: [
    CreateProposal,
    RemoveProposal,
    CreateVoteService,
    CalculateVoteService,
    ListProposalService,
    CountAccountVoteService,
    FindProposalService,
    FindVoteByCreatorService,
    ProposalApprove,
    OnEmergencyProposalCreated,
    ResolveControversyService,
    OnProposalControversyResolved,
  ],
})
export class ProposalModule implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalEntity: EntityRepository<Proposal>,
    private readonly query: QueryBus,
    private readonly eventBus: EventBus,
  ) {}
  onApplicationBootstrap() {
    this.scanProposal();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async scanProposal() {
    const now = new Date();
    const proposals = await this.proposalEntity.findAll({
      where: {
        expiredAt: { $lte: now },
        status: ProposalStatus.Pending,
      },
    });
    const record = new Map<ProposalId, Proposal>();
    for (const p of proposals) {
      record.set(p.id, p);
    }
    const votes = await Promise.all(
      proposals.map((p) => this.query.execute(new CalculateVote(p.id))),
    );
    const eventBox: IEvent[] = [];
    await this.proposalEntity.getEntityManager().transactional(async (em) => {
      const pendingTasks = votes
        .map((vote) => (vote.isOk() ? vote.value : null))
        .filter((vote) => vote !== null)
        .map((vote) => {
          const proposal = record.get(vote.proposalId);
          if (!proposal) {
            throw new ProposalNotFound();
          }
          if (vote.yes === vote.no) {
            const updateResult = proposal.controversy();
            if (updateResult.isErr()) {
              throw updateResult.error;
            }
            eventBox.push(new Controversy(vote.proposalId));
            return this.proposalEntity.upsert(proposal, { em });
          }
          if (vote.yes > vote.no) {
            const updateResult = proposal.approve();
            if (updateResult.isErr()) {
              throw updateResult.error;
            }
            eventBox.push(new Approve(vote.proposalId));
            return this.proposalEntity.upsert(proposal, { em });
          }
          const updateResult = proposal.reject();
          if (updateResult.isErr()) {
            throw updateResult.error;
          }
          eventBox.push(new Reject(vote.proposalId));
          return this.proposalEntity.upsert(proposal, { em });
        });
      await Promise.all(pendingTasks);
    });
    this.eventBus.publishAll(eventBox);
  }
}
