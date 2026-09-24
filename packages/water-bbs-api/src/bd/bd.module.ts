import { Module } from '@nestjs/common';
import { BdService } from './bd.service';
import { BdController } from './bd.controller';

@Module({
  controllers: [BdController],
  providers: [BdService],
})
export class BdModule {}
