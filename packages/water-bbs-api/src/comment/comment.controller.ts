import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import type { CommentId, ReplyId } from './comment.entity';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateCommentReplyRequest,
  GetCommentByResourceIdResponse,
  GetReplyResponse,
  ReplyTree,
} from './dto';
import { type AccountId, User } from '../auth';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({
    summary: '根据资源ID获取评论区',
    operationId: 'getCommentByResourceId',
  })
  @ApiOkResponse({ type: GetCommentByResourceIdResponse })
  @ApiParam({ name: 'resourceID', description: '资源ID' })
  @Get('comment/:resourceID')
  async getCommentByResource(@Param('resourceID') resourceId: string) {
    return this.commentService.getCommentByResourceId(resourceId);
  }

  @ApiOperation({ summary: '获取评论回复树', operationId: 'getReplyTree' })
  @ApiQuery({ name: 'commentId', description: '评论区ID' })
  @ApiQuery({ name: 'size', description: '每页数量' })
  @ApiQuery({ name: 'parentId', description: '父回复ID', required: false })
  @ApiQuery({ name: 'cursor', description: '分页游标', required: false })
  @ApiOkResponse({ type: ReplyTree })
  @Get('replies')
  async listCommentReplies(
    @Query('commentId') commentId: CommentId,
    @Query('size') size: number,
    @Query('parentId') parentId?: ReplyId,
    @Query('cursor') cursor?: string,
  ) {
    return this.commentService.listCommentReplies(
      commentId,
      size,
      parentId,
      cursor,
    );
  }

  @ApiOperation({ summary: '创建评论回复', operationId: 'createCommentReply' })
  @ApiParam({ name: 'commentId', description: '评论区ID', type: 'string' })
  @ApiQuery({ name: 'parentId', description: '父回复ID', required: false })
  @ApiOkResponse({ type: GetReplyResponse })
  @Post(':commentId/reply')
  async createCommentReply(
    @Body() request: CreateCommentReplyRequest,
    @Param('commentId') commentId: CommentId,
    @User('id') id: AccountId,
    @Query('parentId') parentId?: ReplyId,
  ) {
    return this.commentService.createCommentReply(
      commentId,
      request,
      id,
      parentId,
    );
  }
}
