import { Module } from '@nestjs/common';
import { PostApplicationService } from './post.service';
import { PostController } from './post.controller';
import { PostRepo } from './post.repo';
import { HiddenPostAction, ShowPostAction } from './actions';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  FileReference,
  Post,
  Resource,
  ResourceOwnerMap,
} from 'water-bbs-migration';
import { StorageModule } from '@app/storage';
import {
  CreatePostCommandHandler,
  CreateThreadCommandHandler,
  HidePostCommandHandler,
  UploadImageCommandHandler,
} from './commands';
import {
  GetPostSummaryHandler,
  GetPostsHandler,
  GetThreadHandler,
  GetThreadResourcesQueryHandler,
} from './queries';
import { CreateShowPostProposalCommandHandler } from './commands/create-show-post-proposal.command';
import { CreateHidePostProposalCommandHandler } from './commands/create-hide-post-proposal.command';

@Module({
  imports: [
    StorageModule,
    MikroOrmModule.forFeature([
      Post,
      FileReference,
      Resource,
      ResourceOwnerMap,
    ]),
  ],
  controllers: [PostController],
  providers: [
    PostApplicationService,
    PostRepo,
    ShowPostAction,
    HiddenPostAction,
    CreatePostCommandHandler,
    CreateThreadCommandHandler,
    HidePostCommandHandler,
    UploadImageCommandHandler,
    GetPostSummaryHandler,
    GetPostsHandler,
    GetThreadHandler,
    CreateShowPostProposalCommandHandler,
    CreateHidePostProposalCommandHandler,
    GetThreadResourcesQueryHandler,
  ],
})
export class PostModule {}
