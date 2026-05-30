import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import {
  CreateProposal,
  CreateProposalResponse,
} from './dto/create-proposal.dto';
import { ApiPaginatedResponse, Pagination, UseModel, User } from '@app/shared';
import { ProposalEntity } from './entity/propsal.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ProposalSummary } from './entity/proposal-summary.entity';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @ApiOperation({ summary: '获取提案列表' })
  @ApiPaginatedResponse(ProposalSummary)
  @UseModel(Pagination)
  @Get('')
  async listProposal(@Query('page') page: number, @Query('size') size: number) {
    return this.proposalService.listProposals(page, size);
  }

  @ApiOperation({ summary: '获取提案详情' })
  @ApiOkResponse({ type: ProposalEntity })
  @UseModel(ProposalEntity)
  @Get(':id')
  async getProposal(@Param('id') id: string) {
    return this.proposalService.getProposal(id);
  }

  @ApiOperation({ summary: '创建提案' })
  @ApiCreatedResponse({ type: CreateProposalResponse })
  @UseModel(CreateProposalResponse)
  @Post('')
  async createProposal(@Body() dto: CreateProposal, @User() user: RequestUser) {
    return this.proposalService.createProposal(dto, user.account.id);
  }
}
