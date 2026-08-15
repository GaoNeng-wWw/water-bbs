import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { type AccountId, User } from '../auth';
import { type TransactionId } from '@app/gamification';
import { GetBalanceResponse, ListTransactionsResponse } from './dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '获取余额', operationId: 'getBalance' })
  @ApiOkResponse({ type: GetBalanceResponse, description: '余额' })
  @Get('balance')
  async getBalance(@User('id') userId: AccountId) {
    return this.walletService.getBalance(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '获取交易列表', operationId: 'getTransactions' })
  @ApiProperty({ type: 'string', description: '交易ID' })
  @ApiProperty({ type: 'number', description: '每页数量' })
  @ApiOkResponse({ type: ListTransactionsResponse, description: '交易列表' })
  @Get('transactions')
  getTransactions(
    @User('id') userId: AccountId,
    @Query('lastId') lastId?: TransactionId,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    return this.walletService.listTransactions(userId, lastId, limit);
  }
}
