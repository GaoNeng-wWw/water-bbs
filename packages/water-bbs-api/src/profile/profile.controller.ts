import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Public, User, type AccountId } from '../auth';
import { ApiPaginationResponse, DomainError } from '@app/shared';
import {
  ProfileInfo,
  ProfileTopicInfo,
  UpdateProfile,
  UserPublishedTopicList,
} from './dto';
import { err, Result } from 'neverthrow';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserNotExists } from '../auth/errors';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get('{/:id}')
  @ApiOperation({
    summary: '通过Account ID获取用户信息',
    description: '根据Account ID获取用户信息',
    operationId: 'getProfile',
  })
  @ApiOkResponse({ type: ProfileInfo })
  @ApiParam({ name: 'id', description: 'Account ID', required: false })
  @ApiBearerAuth()
  async getProfile(
    @Param('id') id: AccountId,
    @User('id') userId?: AccountId,
  ): Promise<Result<ProfileInfo, DomainError>> {
    if (!id && !userId) {
      return err(new UserNotExists());
    }
    return this.profileService.getProfile(userId ?? id);
  }

  @ApiOperation({
    summary: '通过Account ID获取用户发布的主题',
    description: '根据Account ID获取用户发布的主题',
    operationId: 'getPublishedTopic',
  })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiPaginationResponse(ProfileTopicInfo)
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
    operationId: 'updateProfile',
  })
  @Patch()
  async updateProfile(
    @User('id') id: AccountId,
    @Body() updateProfileDto: UpdateProfile,
  ): Promise<Result<void, DomainError>> {
    return this.profileService.updateProfile(id, updateProfileDto);
  }
}
