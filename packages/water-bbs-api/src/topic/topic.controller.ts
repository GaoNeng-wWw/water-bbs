import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { ApiPaginationResponse, PaginationQuery } from '@app/shared';
import type { CategoryId } from '../category';
import type { ReplyId, TopicId } from './entites';
import { CreateReplyDto } from './dto/create-reply.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { type AccountId, User } from '../auth';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { TopicInfo, UpdateTopicDto, UpdateTopicResponse } from './dto';
import { ReplyInfo, ReplyItem } from './dto/find-reply.dto';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({ summary: '获取回复列表', operationId: 'listReply' })
  @ApiPaginationResponse(ReplyItem)
  @ApiParam({ name: 'topicId', description: '主题ID', type: String })
  @Get('replies/:topicId')
  async listReply(
    @Param('topicId') topicId: TopicId,
    @Query() dto: PaginationQuery,
  ) {
    return this.topicService.listReply(topicId, dto);
  }

  @ApiOperation({ summary: '获取主题列表', operationId: 'listTopic' })
  @ApiPaginationResponse(TopicInfo)
  @ApiParam({ name: 'categoryId', description: '分类ID' })
  @Get(':categoryId')
  async listTopic(
    @Query() dto: PaginationQuery,
    @Param('categoryId') categoryId: CategoryId,
  ) {
    return this.topicService.listTopics(categoryId, dto);
  }

  @ApiOperation({ summary: '创建回复', operationId: 'createReply' })
  @ApiCreatedResponse({ type: ReplyInfo })
  @ApiParam({ name: 'topicId', description: '主题ID', type: String })
  @Post('replies/:topicId')
  async createReply(
    @Param('topicId') topicId: TopicId,
    @Body() dto: CreateReplyDto,
    @User('id') id: AccountId,
  ) {
    return this.topicService.createReply(topicId, dto, id);
  }

  @ApiOperation({ summary: '创建主题', operationId: 'createTopic' })
  @ApiCreatedResponse({ type: TopicInfo })
  @ApiParam({ name: 'categoryId', description: '分类ID' })
  @Post(':categoryId')
  async createTopic(
    @Param('categoryId') categoryId: CategoryId,
    @Body() dto: CreateTopicDto,
    @User('id') id: AccountId,
  ) {
    return this.topicService.createTopic(categoryId, dto, id);
  }

  @ApiOperation({ summary: '删除回复', operationId: 'removeReply' })
  @ApiOkResponse({ type: ReplyInfo })
  @ApiParam({ name: 'replyId', description: '回复ID' })
  @Delete('replies/:replyId')
  async removeReply(
    @Param('replyId') replyId: ReplyId,
    @User('id') id: AccountId,
  ) {
    return this.topicService.removeReply(replyId, id);
  }

  @ApiOperation({ summary: '删除主题', operationId: 'removeTopic' })
  @ApiOkResponse({ type: TopicInfo })
  @ApiParam({ name: 'topicId', description: '主题ID', type: String })
  @Delete(':topicId')
  async removeTopic(
    @Param('topicId') topicId: TopicId,
    @User('id') id: AccountId,
  ) {
    return this.topicService.removeTopic(topicId, id);
  }

  @ApiOperation({ summary: '更新主题', operationId: 'updateTopic' })
  @ApiOkResponse({ type: UpdateTopicResponse })
  @ApiParam({ name: 'topicId', description: '主题ID', type: String })
  @Patch(':topicId')
  async updateTopic(
    @Param('topicId') topicId: TopicId,
    @Body() dto: UpdateTopicDto,
    @User('id') id: AccountId,
  ) {
    return this.topicService.updateTopic(topicId, id, dto);
  }
}
