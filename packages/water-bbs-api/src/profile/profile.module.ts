import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { OnTopicCreated, OnTopicRemoved } from './event-handler';
import {
  GetAccountPublishedTopicService,
  GetAccountPublishedTopicTotalService,
  GetProfileService,
} from './query';
import { UpdateProfileService } from './commands';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Reply, Topic } from '../topic';
import { Profile } from '../auth';
import { Category } from '../category';

@Module({
  imports: [MikroOrmModule.forFeature([Profile, Topic, Reply, Category])],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    OnTopicCreated,
    OnTopicRemoved,
    GetAccountPublishedTopicTotalService,
    GetAccountPublishedTopicService,
    GetProfileService,
    UpdateProfileService,
  ],
})
export class ProfileModule {}
