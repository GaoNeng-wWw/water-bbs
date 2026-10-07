import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import {
  UserAccountBanned,
  UserAccountOnline,
  UserGovernanceAdminIs,
  UserGovernanceAdminWas,
  UserGovernanceBdIs,
  UserGovernanceBdList,
  UserGovernanceBdWas,
  UserGovernanceMemberActive,
  UserGovernanceMemberList,
  UserProfileAvatar,
  UserProfileBio,
  UserProfileNick,
} from './providers';
import { FieldService } from './field.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Profile } from 'src/auth';
import { GovernanceMember } from '../../governance/member/member.entity';

@Module({
  imports: [
    DiscoveryModule,
    MikroOrmModule.forFeature([Profile, GovernanceMember]),
  ],
  providers: [
    UserAccountBanned,
    UserAccountOnline,
    UserProfileNick,
    UserProfileAvatar,
    UserProfileBio,
    UserGovernanceMemberList,
    UserGovernanceMemberActive,
    UserGovernanceAdminIs,
    UserGovernanceAdminWas,
    UserGovernanceBdIs,
    UserGovernanceBdWas,
    UserGovernanceBdList,
    FieldService,
  ],

  exports: [
    FieldService,
    UserAccountBanned,
    UserAccountOnline,
    UserProfileNick,
    UserProfileAvatar,
    UserProfileBio,
    UserGovernanceMemberList,
    UserGovernanceMemberActive,
    UserGovernanceAdminIs,
    UserGovernanceAdminWas,
    UserGovernanceBdIs,
    UserGovernanceBdWas,
    UserGovernanceBdList,
  ],
})
export class FieldModule {}
