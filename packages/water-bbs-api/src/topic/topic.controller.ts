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

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get('replies/:topic-id')
  async listReply(
    @Param('topic-id') topicId: TopicId,
    @Query() dto: PaginationQuery,
  ) {
    return this.topicService.listReply(topicId, dto);
  }

  @Get(':category-id')
  async listTopic(
    @Query() dto: PaginationQuery,
    @Param('category-id') categoryId: CategoryId,
  ) {
    return this.topicService.listTopics(categoryId, dto);
  }

  @Post('replies/:topic-id')
  async createReply(
    @Param('topic-id') topicId: TopicId,
    @Body() dto: CreateReplyDto,
  ) {
    return this.topicService.createReply(topicId, dto, '');
  }

  @Post(':category-id')
  async createTopic(
    @Param('category-id') categoryId: CategoryId,
    @Body() dto: CreateTopicDto,
  ) {
    return this.topicService.createTopic(categoryId, dto, '');
  }

  @Delete('replies/:reply-id')
  async removeReply(@Param('reply-id') replyId: ReplyId) {
    return this.topicService.removeReply(replyId, '');
  }

  @Post(':topic-id')
  async removeTopic(@Param('topic-id') topicId: TopicId) {
    return this.topicService.removeTopic(topicId, '');
  }
}
