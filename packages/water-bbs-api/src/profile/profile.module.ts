import { Get, Module } from '@nestjs/common';
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
import { GetAvatarService } from './query/get-avatar.query';
import { UploadAvatarService } from './commands/upload-avatar.command';
import { StorageModule } from '@app/storage';

@Module({
  imports: [
    StorageModule,
    MikroOrmModule.forFeature([Profile, Topic, Reply, Category])
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    OnTopicCreated,
    OnTopicRemoved,
    GetAccountPublishedTopicTotalService,
    GetAccountPublishedTopicService,
    GetProfileService,
    UpdateProfileService,
    UploadAvatarService,
    GetAvatarService,
  ],
})
export class ProfileModule {}
