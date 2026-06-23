import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteHandler } from './commands/create-vote.command';
import { GetVoteCountHandler, ListProposalComment } from './queries';
import { Vote, VoteSlot } from 'water-bbs-migration';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { VoteRepository } from './vote.repo';
import { PolicyModule } from '@app/policy';
import { BankModule } from '@app/bank';

@Module({
  imports: [
    BankModule,
    PolicyModule,
    MikroOrmModule.forFeature([Vote, VoteSlot])
  ],
  providers: [
    VoteRepository,
    VoteService,
    CreateVoteHandler,
    GetVoteCountHandler,
    ListProposalComment,
  ],
})
export class VoteModule {}
