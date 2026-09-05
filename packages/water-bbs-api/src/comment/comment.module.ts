import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import {
  CreateCommentService,
  RemoveCommentReplyService,
  RemoveCommentService,
  RestoreCommentService,
} from './command';
import {
  GetReplyService,
  GetReplyTreeService,
  ListCommentIdService,
} from './query';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Comment, CommentReply } from './comment.entity';
import { ReplyCreatedHandler } from './event-handler';
import { CreateCommentReplyService } from './command/create-comment-reply.command';

@Module({
  imports: [MikroOrmModule.forFeature([Comment, CommentReply])],
  controllers: [CommentController],
  providers: [
    CommentService,
    CreateCommentService,
    RemoveCommentService,
    RestoreCommentService,
    ListCommentIdService,
    ReplyCreatedHandler,
    GetReplyTreeService,
    GetReplyService,
    CreateCommentReplyService,
    RemoveCommentReplyService,
  ],
})
export class CommentModule {}
