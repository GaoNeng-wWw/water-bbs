import { Module } from '@nestjs/common';
import { PostApplicationService } from './post.service';
import { PostController } from './post.controller';
import { PostRepo } from './post.repo';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostApplicationService, PostRepo],
})
export class PostModule {}
