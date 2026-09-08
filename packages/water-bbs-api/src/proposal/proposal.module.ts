import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { EngineModule } from '@app/engine';

@Module({
  imports: [EngineModule],
  controllers: [ProposalController],
  providers: [ProposalService],
})
export class ProposalModule {}
