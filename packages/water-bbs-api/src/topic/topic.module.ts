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
import { GetTopicService } from './query/get-topic.query';
import { GetReplyService } from './query/get-reply.query';
import {
  OnReplyRemoved,
  OnTopicRemoved,
  OnTopicCreated,
  OnReplyCreated,
} from './event-handler';

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
    GetTopicService,
    GetReplyService,
    OnReplyRemoved,
    OnTopicRemoved,
    OnTopicCreated,
    OnReplyCreated,
  ],
})
export class TopicModule {}
