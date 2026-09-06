import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import type { CommentId, ReplyId } from './comment.entity';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateCommentReplyRequest } from './dto';
import { type AccountId, User } from '../auth';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '获取评论回复树' })
  @ApiQuery({ name: 'commentId', description: '评论区ID' })
  @ApiQuery({ name: 'size', description: '每页数量' })
  @ApiQuery({ name: 'parentId', description: '父回复ID' })
  @ApiQuery({ name: 'cursor', description: '分页游标' })
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

  @ApiOperation({ summary: '创建评论回复' })
  @Post(':commentId/reply')
  async createCommentReply(
    @Body() request: CreateCommentReplyRequest,
    @Param('commentId') commentId: CommentId,
    @User('id') id: AccountId,
  ) {
    return this.commentService.createCommentReply(commentId, request, id);
  }
}
