import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
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
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProposalSummary } from './entity/proposal-summary.entity';
import { VoteComment } from '../vote/dto/list-vote.dto';
import { CreateVote } from './dto/create-vote.dto';
import { CreateVoteResponse } from '../vote/dto/create-vote.dto';
import {
  CreateProposalCommandResponse,
  CreateProposalCommentDto,
} from './dto/create-proposal-comment.dto';
import { ProposalComment } from './dto/list-proposal-comments.dto';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @ApiOperation({ summary: '获取提案列表' })
  @ApiPaginatedResponse(ProposalSummary)
  @ApiQuery({ name: 'page', description: '页码' })
  @ApiQuery({ name: 'size', description: '每页数量' })
  @UseModel(Pagination)
  @UseModel(Pagination)
  @Get('')
  async listProposal(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    return this.proposalService.listProposals(page, size);
  }

  @ApiOperation({ summary: '获取提案详情' })
  @ApiOkResponse({ type: ProposalEntity })
  @ApiParam({ name: 'id', description: '提案ID' })
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

  @ApiOkResponse({ type: Pagination })
  @ApiPaginatedResponse(VoteComment)
  @UseModel(Pagination)
  @ApiParam({ name: 'id', description: '提案ID' })
  @Get(':id/votes')
  async getProposalVotes(
    @Param('id') id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    return this.proposalService.listProposalVotes(id, page, size);
  }

  @Post(':id/vote')
  @ApiCreatedResponse({ type: CreateVoteResponse })
  @UseModel(CreateVoteResponse)
  async voteProposal(
    @Param('id') id: string,
    @Body() dto: CreateVote,
    @User() user: RequestUser,
  ) {
    return this.proposalService.votingProposal(
      id,
      dto.action,
      user.account.id,
      dto.content,
    );
  }

  @Post(':id/comment')
  @ApiCreatedResponse({ type: CreateProposalCommandResponse })
  @UseModel(CreateProposalCommandResponse)
  @ApiParam({ name: 'id', description: '提案ID' })
  createProposalComment(
    @Param('id') id: string,
    @Body() dto: CreateProposalCommentDto,
    @User() user: RequestUser,
  ) {
    return this.proposalService.createProposalComment(id, dto, user.account.id);
  }

  @ApiOperation({ summary: '获取提案评论列表' })
  @ApiParam({ name: 'id', description: '提案ID' })
  @ApiQuery({ name: 'page', description: '页码' })
  @ApiQuery({ name: 'size', description: '每页数量' })
  @ApiPaginatedResponse(ProposalComment)
  @UseModel(Pagination)
  @ApiOkResponse({ type: Pagination })
  @Get(':id/comments')
  async listProposalComments(
    @Param('id') id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    return this.proposalService.findProposalComments(id, page, size);
  }
}
