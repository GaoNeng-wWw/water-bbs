import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Proposals } from 'water-bbs-migration';
import { ProposalRepository } from './proposal.repo';
import { FindAllActiveProposalQueryHandler } from './queries';
import { ExecuteProposalHandler } from './command';
import { ProposalDomainService } from './proposal.domain.service';
import { CronProposalRunner } from './cron-proposal.infra';

@Module({
  imports: [MikroOrmModule.forFeature([Proposals])],
  controllers: [ProposalController],
  providers: [
    ProposalRepository,
    ProposalService,
    FindAllActiveProposalQueryHandler,
    ExecuteProposalHandler,
    ProposalDomainService,
    CronProposalRunner,
  ],
})
export class ProposalModule {}
