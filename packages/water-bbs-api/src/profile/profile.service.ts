import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AccountId } from '../auth';
import {
  UpdateProfile as UpdateProfileDto,
  ProfileInfo,
  UserPublishedTopicList,
} from './dto';
import { err, ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { UpdateProfile } from './commands';
import {
  GetAccountPublishedTopic,
  GetAccountPublishedTopicTotal,
  GetProfileQuery,
} from './query';

@Injectable()
export class ProfileService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async updateProfile(
    accountId: AccountId,
    updateProfile: UpdateProfileDto,
  ): Promise<Result<void, DomainError>> {
    return this.commandBus.execute(new UpdateProfile(accountId, updateProfile));
  }

  async getProfile(
    accountId: AccountId,
  ): Promise<Result<ProfileInfo, DomainError>> {
    return this.queryBus.execute(new GetProfileQuery(accountId));
  }

  async getPublishedTopic(
    accountId: AccountId,
    page: number,
    size: number,
  ): Promise<Result<UserPublishedTopicList, DomainError>> {
    const publishTopic = await this.queryBus.execute(
      new GetAccountPublishedTopic(accountId, page, size),
    );
    if (publishTopic.isErr()) {
      return err(publishTopic.error);
    }
    const total = await this.queryBus.execute(
      new GetAccountPublishedTopicTotal(accountId),
    );
    if (total.isErr()) {
      return err(total.error);
    }
    return ok(new UserPublishedTopicList(publishTopic.value, total.value));
  }
}
