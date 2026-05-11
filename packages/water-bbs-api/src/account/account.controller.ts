import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { RemoveAccountResponse } from './dto/remove-account.dto';
import { Public, User } from '@app/shared';
import { UpdatePassword } from './dto/update-password.dto';
import { AccountID } from './domain';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOkResponse({
    type: GetProfileResponse,
  })
  @Get('profile/:id')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.accountService.getProfile(id);
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
    if (isErr(res)){
      return res;
    }
    return res.value;
  }
}
