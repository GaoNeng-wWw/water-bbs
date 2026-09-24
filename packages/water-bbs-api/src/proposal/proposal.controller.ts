import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { CursorDTO } from '@app/shared';
import { Member, MemberKind, type ProposalId } from '@app/gamification';
import {
  CreateProposalDTO,
  CreateProposalResponseDTO,
} from './dto/create-proposal.dto';
import { type AccountId, User } from 'src/auth';
import {
  VoteProposalDTO,
  VoteProposalResponseDTO,
} from './dto/vote-proposal.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ListProposalResponse } from './dto/list-proposal.dto';
import { StepInfo } from './dto/list-steps.dto';
import { FindProposalResponseDTO } from './dto/find-proposal.dto';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @ApiOperation({ description: '获取提案步骤', operationId: 'listSteps' })
  @ApiOkResponse({ description: '获取提案步骤', type: [StepInfo] })
  @Get('steps')
  listSteps() {
    return this.proposalService.listSteps();
  }

  @ApiQuery({ name: 'cursor', description: '分页游标', required: false })
  @ApiQuery({ name: 'size', description: '每页数量' })
  @ApiOkResponse({ description: '获取提案列表', type: ListProposalResponse })
  @ApiOperation({
    summary: '获取提案列表',
    description: '分页获取提案列表',
    operationId: 'listProposalItems',
  })
  @Get('')
  async listProposal(@Query() dto: CursorDTO) {
    return this.proposalService.listProposal(dto);
  }

  @ApiOperation({ description: '提案详情', operationId: 'findProposal' })
  @ApiOkResponse({ description: '提案详情', type: FindProposalResponseDTO })
  @ApiParam({ name: 'id', description: '提案ID', type: String })
  @Get(':id')
  async findProposal(@Param('id') id: ProposalId) {
    return this.proposalService.findProposal(id);
  }

  @ApiOperation({ description: '创建提案', operationId: 'createProposal' })
  @ApiCreatedResponse({
    description: '创建提案',
    type: CreateProposalResponseDTO,
  })
  @ApiParam({ name: 'accountId', description: '用户ID' })
  @Post('')
  async createProposal(
    @Body() body: CreateProposalDTO,
    @User('id') accountId: AccountId,
  ) {
    return this.proposalService.createProposal(body, accountId);
  }

  @ApiOperation({
    summary: '解决争议',
    operationId: 'resolveControversy',
    description: '解决争议, 只有BD或Admin才可以解决争议.',
  })
  @ApiOkResponse({ description: '解决争议' })
  @ApiParam({ name: 'accountId', description: '用户ID' })
  @ApiQuery({
    name: 'kind',
    description: '解决类型',
    enum: ['approve', 'reject'],
  })
  @Post(':id/resolve')
  @ApiParam({ name: 'id', description: '提案ID' })
  @Member(MemberKind.BD)
  async resolveControversy(
    @Param('id') id: ProposalId,
    @User('id') accountId: AccountId,
    @Query('kind') kind: string,
  ) {
    return this.proposalService.resolveControversy(id, accountId, kind);
  }

  @ApiOperation({
    summary: '投票提案',
    operationId: 'voteProposal',
    description: '投票提案, 一个提案每人只能投1票',
  })
  @ApiOkResponse({ description: '投票提案', type: VoteProposalResponseDTO })
  @ApiParam({ name: 'accountId', description: '用户ID' })
  @Post('vote')
  async voteProposal(
    @Body() body: VoteProposalDTO,
    @User('id') accountId: AccountId,
  ) {
    return this.proposalService.vote(body, accountId);
  }
}
