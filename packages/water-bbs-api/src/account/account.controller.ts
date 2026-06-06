import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AccountService } from './application';
import { CreateAccountResponse, RegisterDTO } from './dto/register.dto';
import { isErr } from 'water-bbs-shared';
import { RemoveAccountDTO } from './application/dto/remove-account.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import {
  UpdateProfileDTO,
  UpdateProfileResponse,
} from './dto/update-profile.dto';
import { GetProfileResponse } from './dto/get-profile.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { RemoveAccountResponse } from './dto/remove-account.dto';
import { Public, UseModel, User } from '@app/shared';
import { UpdatePassword } from './dto/update-password.dto';
import { AccountID } from './domain';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAvatarResponse } from './dto/update-avatar.dto';
import { AvatarUploadDto } from './dto/avatar-upload.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseModel(GetProfileResponse)
  @ApiOkResponse({
    type: GetProfileResponse,
  })
  @Get('profile')
  async getProfile(@User() user: RequestUser) {
    const uid = user.account.id;
    const res = await this.accountService.getProfile(uid);
    if (isErr(res)) {
      return res;
    }
    const resp = res.value;
    return new GetProfileResponse(
      resp.id,
      resp.username,
      resp.bio,
      resp.avatar,
    );
  }

  @Public()
  @UseModel(GetProfileResponse)
  @ApiOkResponse({
    type: GetProfileResponse,
  })
  @ApiParam({ name: 'id' })
  @Get('profile/:id')
  async getAccountProfile(@Param('id') id: string) {
    const uid = id;
    const res = await this.accountService.getProfile(uid);
    if (isErr(res)) {
      return res;
    }
    const resp = res.value;
    return new GetProfileResponse(
      resp.id,
      resp.username,
      resp.bio,
      resp.avatar,
    );
  }

  @ApiOkResponse({
    type: UpdateProfileResponse,
  })
  @Patch('profile')
  async updateProfile(
    @User() { account: { id } }: RequestUser,
    @Body() dto: UpdateProfileDTO,
  ) {
    const res = await this.accountService.updateProfile(id, dto);
    if (isErr(res)) {
      return res;
    }
    return res.value;
  }

  // TODO: 移动到AUTH里
  @UseModel(CreateAccountResponse)
  @Public()
  @ApiCreatedResponse({ type: CreateAccountResponse })
  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    const res = await this.accountService.createAccount({
      ...dto,
      cert_type: 'password',
      cert_value: dto.password,
    });
    if (isErr(res)) {
      return res;
    }
    return res.value;
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: RemoveAccountResponse })
  @Delete()
  async delete(@User() { account: { id } }: RequestUser) {
    const res = await this.accountService.removeAccount(
      new RemoveAccountDTO(id),
    );
    if (isErr(res)) {
      return res;
    }
    return res.value;
  }
  @ApiBearerAuth()
  @Patch('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    const res = await this.accountService.resetPassword({
      ...dto,
      force: false,
    });
    if (isErr(res)) {
      return res;
    }
    return res.value;
  }

  @Patch('password')
  async updatePassword(
    @User() { account: { id } }: RequestUser,
    @Body() dto: UpdatePassword,
  ) {
    const res = await this.accountService.updatePassword({
      accountID: new AccountID({ value: id }),
      ...dto,
    });
    if (isErr(res)) {
      return res;
    }
    return res.value;
  }

  @UseModel(UpdateAvatarResponse)
  @ApiCreatedResponse({ type: UpdateAvatarResponse })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AvatarUploadDto })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @Post('avatar')
  async uploadAvatar(
    @User() user: RequestUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.accountService.uploadAvatar(user.account.id, file);
  }

  @Get('permission')
  @ApiOperation({ summary: '获取用户权限' })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [String],
  })
  async getPermission(@User() user: RequestUser) {
    return this.accountService.getPermission(user.account.id);
  }
}
