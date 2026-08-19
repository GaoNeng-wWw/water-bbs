import { Module } from '@nestjs/common';
import { StepDiscoverService } from './step-discover.service';

@Module({
  providers: [StepDiscoverService],
  exports: [StepDiscoverService],
})
export class StepModule {}
