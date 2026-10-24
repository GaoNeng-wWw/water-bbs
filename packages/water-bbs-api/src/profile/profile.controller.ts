import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { Public, User, type AccountId } from '../auth';
import {
  ApiPaginationResponse,
  ApplicationError,
  DomainError,
} from '@app/shared';
import {
  ProfileInfo,
  ProfileTopicInfo,
  UpdateProfile,
  UserPublishedTopicList,
} from './dto';
import { err, ok, Result } from 'neverthrow';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserNotExists } from '../auth/errors';
import { type Response } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @ApiOperation({
    summary: '通过Account ID获取用户头像',
    description: '根据Account ID获取用户头像',
    operationId: 'getAvatar',
  })
  @ApiParam({ name: 'id', description: 'Account ID', required: false })
  @Get('avatar/{:id}')
  async getAvatar(
    @Param('id') id: AccountId,
    @Res() res: Response,
  ): Promise<Result<Buffer, ApplicationError>> {
    const getAvatarRes = await this.profileService.getAvatar(id);
    if (getAvatarRes.isErr()) {
      return getAvatarRes;
    }
    const buffer = getAvatarRes.value;
    res.type('image/png');
    res.send(buffer);
    return ok(buffer);
  }

  @ApiOperation({
    summary: '上传用户头像',
    description: '上传用户头像',
    operationId: 'uploadAvatar',
  })
  @ApiOkResponse({ type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '头像文件',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @User('id') id: AccountId,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Result<string, ApplicationError>> {
    return this.profileService.uploadAvatar(id, file);
  }

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
    @Param('id') id?: AccountId,
    @User('id') userId?: AccountId,
  ): Promise<Result<ProfileInfo, DomainError>> {
    const accountId = id === '{id}' || !id ? userId : id;
    if (!accountId) {
      return err(new UserNotExists());
    }
    return this.profileService.getProfile(accountId);
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
