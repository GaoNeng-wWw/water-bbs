import { Module } from '@nestjs/common';
import { ResolverDiscoverService } from './resolver-discover.service';

@Module({
  imports: [],
  providers: [ResolverDiscoverService],
  exports: [ResolverDiscoverService],
})
export class ResolverModule {}
