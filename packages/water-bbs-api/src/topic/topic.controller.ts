import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { PaginationQuery } from '@app/shared';
import type { CategoryId } from '../category';
import type { ReplyId, TopicId } from './entites';
import { CreateReplyDto } from './dto/create-reply.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { type AccountId, User } from '../auth';
import { ApiCreatedResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { TopicInfo } from './dto';
import { ReplyInfo } from './dto/find-reply.dto';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOkResponse({ type: ReplyInfo })
  @ApiParam({ name: 'topic-id', description: '主题ID' })
  @Get('replies/:topic-id')
  async listReply(
    @Param('topic-id') topicId: TopicId,
    @Query() dto: PaginationQuery,
  ) {
    return this.topicService.listReply(topicId, dto);
  }

  @ApiOkResponse({ type: TopicInfo })
  @ApiParam({ name: 'category-id', description: '分类ID' })
  @Get(':category-id')
  async listTopic(
    @Query() dto: PaginationQuery,
    @Param('category-id') categoryId: CategoryId,
  ) {
    return this.topicService.listTopics(categoryId, dto);
  }

  @ApiCreatedResponse({ type: ReplyInfo })
  @ApiParam({ name: 'topic-id', description: '主题ID' })
  @Post('replies/:topic-id')
  async createReply(
    @Param('topic-id') topicId: TopicId,
    @Body() dto: CreateReplyDto,
    @User('id') id: AccountId,
  ) {
    return this.topicService.createReply(topicId, dto, id);
  }

  @ApiCreatedResponse({ type: TopicInfo })
  @ApiParam({ name: 'category-id', description: '分类ID' })
  @Post(':category-id')
  async createTopic(
    @Param('category-id') categoryId: CategoryId,
    @Body() dto: CreateTopicDto,
    @User('id') id: AccountId,
  ) {
    return this.topicService.createTopic(categoryId, dto, id);
  }

  @ApiOkResponse({ type: ReplyInfo })
  @ApiParam({ name: 'reply-id', description: '回复ID' })
  @Delete('replies/:reply-id')
  async removeReply(
    @Param('reply-id') replyId: ReplyId,
    @User('id') id: AccountId,
  ) {
    return this.topicService.removeReply(replyId, id);
  }

  @ApiOkResponse({ type: TopicInfo })
  @ApiParam({ name: 'topic-id', description: '主题ID' })
  @Delete(':topic-id')
  async removeTopic(
    @Param('topic-id') topicId: TopicId,
    @User('id') id: AccountId,
  ) {
    return this.topicService.removeTopic(topicId, id);
  }
}
