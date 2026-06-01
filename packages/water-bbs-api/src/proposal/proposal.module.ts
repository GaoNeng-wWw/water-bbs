import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Proposals } from 'water-bbs-migration';
import { ProposalRepository } from './proposal.repo';

@Module({
  imports: [MikroOrmModule.forFeature([Proposals])],
  controllers: [ProposalController],
  providers: [ProposalRepository, ProposalService],
})
export class ProposalModule {}
