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
import { Category } from '../category';
import { HideTopic, RemoveTopic } from './steps';

@Module({
  imports: [MikroOrmModule.forFeature([Topic, Reply, Profile, Category])],
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
    HideTopic,
    RemoveTopic,
  ],
})
export class TopicModule {}
