import { Module } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { BankModule } from '@app/bank';

@Module({
  imports: [BankModule],
  providers: [CheckInService],
  exports: [CheckInService],
})
export class CheckInModule {}
