import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PutPolicy, UpdatePolicy } from './commands';
import { FindPolicyQuery } from './query';
import { Policy } from 'water-bbs-migration';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Policy])],
  providers: [PolicyService, PutPolicy, UpdatePolicy, FindPolicyQuery],
  exports: [PolicyService],
})
export class PolicyModule {}
