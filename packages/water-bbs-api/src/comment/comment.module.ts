import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import {
  CreateCommentService,
  RemoveCommentService,
  RestoreCommentService,
} from './command';
import { ListCommentIdService } from './query';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Comment } from './comment.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [
    CommentService,
    CreateCommentService,
    RemoveCommentService,
    RestoreCommentService,
    ListCommentIdService,
  ],
})
export class CommentModule {}
