import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import {
  CreateReplyService,
  CreateTopicService,
  HideTopicService,
  RemoveReplyService,
  RemoveTopicService,
  UpdateTopicService,
} from './commands';
import {
  GetReplyTotalService,
  GetTopicTotalService,
  ListReplyService,
  ListTopicService,
} from './query';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Reply, Topic } from './entites';
import { Profile } from '../auth';

@Module({
  imports: [MikroOrmModule.forFeature([Topic, Reply, Profile])],
  controllers: [TopicController],
  providers: [
    TopicService,
    CreateTopicService,
    CreateReplyService,
    HideTopicService,
    RemoveReplyService,
    RemoveTopicService,
    UpdateTopicService,
    GetReplyTotalService,
    GetTopicTotalService,
    ListReplyService,
    ListTopicService,
  ],
})
export class TopicModule {}
