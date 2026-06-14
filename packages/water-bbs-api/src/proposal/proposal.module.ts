import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Proposals, Vote, VoteSlot } from 'water-bbs-migration';
import { ProposalRepository } from './proposal.repo';
import {
  FindAllActiveProposalQueryHandler,
  GetProposalHandler,
  ListProposalsHandler,
} from './queries';
import { ExecuteProposalHandler, CreateProposalHandler } from './command';
import { ProposalDomainService } from './proposal.domain.service';
import { CronProposalRunner } from './cron-proposal.infra';
import { VoteRepository } from '../vote/vote.repo';

@Module({
  imports: [MikroOrmModule.forFeature([Proposals, Vote, VoteSlot])],
  controllers: [ProposalController],
  providers: [
    VoteRepository,
    ProposalRepository,
    ProposalService,
    FindAllActiveProposalQueryHandler,
    GetProposalHandler,
    ListProposalsHandler,
    ExecuteProposalHandler,
    CreateProposalHandler,
    ProposalDomainService,
    CronProposalRunner,
  ],
})
export class ProposalModule {}
