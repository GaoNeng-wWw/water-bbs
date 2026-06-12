import { Module } from '@nestjs/common';
import { PostApplicationService } from './post.service';
import { PostController } from './post.controller';
import { PostRepo } from './post.repo';
import { HiddenPostAction, ShowPostAction } from './actions';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FileReference, Post } from 'water-bbs-migration';
import { StorageModule } from '@app/storage';

@Module({
  imports: [StorageModule, MikroOrmModule.forFeature([Post, FileReference])],
  controllers: [PostController],
  providers: [
    PostApplicationService,
    PostRepo,
    ShowPostAction,
    HiddenPostAction,
  ],
})
export class PostModule {}
