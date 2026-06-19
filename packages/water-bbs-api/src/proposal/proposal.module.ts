import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  ProposalComment,
  Proposals,
  Vote,
  VoteSlot,
} from 'water-bbs-migration';
import { ProposalRepository } from './proposal.repo';
import {
  FindAllActiveProposalQueryHandler,
  FindProposalComments,
  GetProposalHandler,
  ListProposalsHandler,
} from './queries';
import {
  ExecuteProposalHandler,
  CreateProposalHandler,
  CreateProposalComment,
} from './command';
import { ProposalDomainService } from './proposal.domain.service';
import { CronProposalRunner } from './cron-proposal.infra';
import { VoteRepository } from '../vote/vote.repo';
import { WorkflowModule, WorkflowService } from '@app/workflow';

@Module({
  imports: [
    WorkflowModule.forRootAsync({
      inject: [WorkflowService],
      useFactory: (workflowService: WorkflowService) => {
        return {
          onDisocver(name, schema) {
            if (!schema) {
              return Promise.resolve();
            }
            return workflowService.save(name, schema);
          },
        };
      },
    }),
    MikroOrmModule.forFeature([Proposals, Vote, VoteSlot, ProposalComment]),
  ],
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
    CreateProposalComment,
    FindProposalComments,
  ],
})
export class ProposalModule {}
