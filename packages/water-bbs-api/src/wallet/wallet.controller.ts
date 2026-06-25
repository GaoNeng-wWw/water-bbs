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
import { ApiOkResponse } from '@nestjs/swagger';
import { GetBalanceResponse } from './dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOkResponse({ type: GetBalanceResponse })
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
