import {
  Controller,
  Get,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { User } from '@app/shared';
import { Direction } from './query/get-transaction-list';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @Get('balance')
  getBalance(@User() user: RequestUser) {
    return this.walletService.getBalance(user.account.id);
  }

  @Get('transcation')
  listTranscation(
    @User() user: RequestUser,
    @Query('year', ParseIntPipe) year: number,
    @Query('direction', new ParseEnumPipe(Direction)) direction: Direction,
  ) {
    return this.walletService.listTranscation(user.account.id, year, direction);
  }
}
