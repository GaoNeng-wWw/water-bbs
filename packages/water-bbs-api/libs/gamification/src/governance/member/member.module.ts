import { Module } from '@nestjs/common';
import {
  CreateMemberService,
  ResignGovernanceMemberService,
  RevokeGovernanceMembershipService,
  TransferAdminService,
} from './commands';
import {
  GetAccountGovernanceMemberListService,
  GetAccountGovernanceMemberService,
} from './query';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GovernanceMember } from './member.entity';

@Module({
  imports: [MikroOrmModule.forFeature([GovernanceMember])],
  providers: [
    CreateMemberService,
    ResignGovernanceMemberService,
    RevokeGovernanceMembershipService,
    TransferAdminService,
    GetAccountGovernanceMemberListService,
    GetAccountGovernanceMemberService,
  ],
})
export class GovernanceMemberModule {}
