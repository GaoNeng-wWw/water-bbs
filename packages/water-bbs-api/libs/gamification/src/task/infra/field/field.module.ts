import { Module } from '@nestjs/common';
import { FieldDiscoverService } from './field.discover';
import { DiscoveryModule } from '@nestjs/core';
import {
  UserIDField,
  UserNickField,
  UserAvatarField,
  UserBioField,
  UserGovernanceAdminWasField,
  UserGovernanceBDWasField,
  UserGovernanceAdminIsField,
  UserGovernanceBDIsField,
} from './provider';

@Module({
  imports: [DiscoveryModule],
  providers: [
    UserIDField,
    UserNickField,
    UserAvatarField,
    UserBioField,
    UserGovernanceAdminWasField,
    UserGovernanceBDWasField,
    UserGovernanceBDIsField,
    UserGovernanceAdminIsField,
    FieldDiscoverService,
  ],
  exports: [
    UserIDField,
    UserNickField,
    UserAvatarField,
    UserBioField,
    UserGovernanceAdminWasField,
    UserGovernanceBDWasField,
    UserGovernanceBDIsField,
    UserGovernanceAdminIsField,
    FieldDiscoverService,
  ],
})
export class FieldModule {}
