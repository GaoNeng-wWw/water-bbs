import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Public, User, type AccountId } from '../auth';
import { ApiPaginationResponse, DomainError } from '@app/shared';
import {
  ProfileInfo,
  TopicInfo,
  UpdateProfile,
  UserPublishedTopicList,
} from './dto';
import { Result } from 'neverthrow';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: '通过Account ID获取用户信息',
    description: '根据Account ID获取用户信息',
  })
  @ApiOkResponse({ type: ProfileInfo })
  @ApiParam({ name: 'id', description: 'Account ID' })
  async getProfile(
    @Param('id') id: AccountId,
  ): Promise<Result<ProfileInfo, DomainError>> {
    return this.profileService.getProfile(id);
  }

  @ApiOperation({
    summary: '通过Account ID获取用户发布的主题',
    description: '根据Account ID获取用户发布的主题',
  })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiPaginationResponse(TopicInfo)
  @Get(':id/published-topic')
  @ApiQuery({ name: 'page', description: 'Page number' })
  @ApiQuery({ name: 'size', description: 'Page size' })
  async getPublishedTopic(
    @Param('id') id: AccountId,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<Result<UserPublishedTopicList, DomainError>> {
    return this.profileService.getPublishedTopic(id, page, size);
  }

  @ApiOperation({
    summary: '更新用户信息',
  })
  @Patch()
  async updateProfile(
    @User('id') id: AccountId,
    @Body() updateProfileDto: UpdateProfile,
  ): Promise<Result<void, DomainError>> {
    return this.profileService.updateProfile(id, updateProfileDto);
  }
}
