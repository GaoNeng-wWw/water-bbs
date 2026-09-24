import { Controller, Get, Param } from '@nestjs/common';
import { BdService } from './bd.service';
import { User, type AccountId } from '../auth';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GovernanceMemberInfo } from './dto/get-record.dto';
import { ApiCursorPagination } from '@app/shared';

@Controller('bd')
export class BdController {
  constructor(private readonly bdService: BdService) {}

  @Get('me')
  @ApiOperation({ summary: '获取当前用户记录', operationId: 'getSelfRecord' })
  @ApiOkResponse({ type: GovernanceMemberInfo })
  async getSelfRecord(@User('id') user: AccountId) {
    return this.bdService.getBdRecord(user);
  }

  @ApiOperation({ summary: '获取用户记录', operationId: 'getBdRecord' })
  @ApiParam({ name: 'id', description: '用户ID', type: String })
  @ApiOkResponse({ type: GovernanceMemberInfo })
  @Get(':id')
  async getBdRecord(@Param('id') id: AccountId) {
    return this.bdService.getBdRecord(id);
  }

  @ApiOperation({ summary: '获取用户所有记录', operationId: 'getBdRecordList' })
  @ApiParam({ name: 'id', description: '用户ID', type: String })
  @ApiCursorPagination(GovernanceMemberInfo)
  @Get(':id/list')
  async getBdRecordList(@Param('id') id: AccountId) {
    return this.bdService.getBdRecordList(id);
  }
}
