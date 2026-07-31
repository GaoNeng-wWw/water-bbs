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

@Module({
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
