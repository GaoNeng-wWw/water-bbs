import { Module } from '@nestjs/common';
import { CelService } from './cel.service';
import { FieldModule } from '../fields';

@Module({
  imports: [FieldModule],
  providers: [CelService],
  exports: [CelService],
})
export class CelModule {}
