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
import { RegisterDTO } from './dto/register.dto';
import { isErr } from 'water-bbs-shared';
import { RemoveAccountDTO } from './application/dto/remove-account.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get('profile/:id')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.accountService.getProfile(id);
    if (isErr(res)) {
      return res;
    }
    return res.value;
  }

  @Patch('profile/:id')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDTO,
  ) {
    // TODO: 等Auth写完, 从Request中获取id
    const res = await this.accountService.updateProfile(id, dto);
    if (isErr(res)) {
      return res;
    }
    return res.value;
  }

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

  // TODO: 鉴权, 需要 ACCOUNT:REMOVE-FORCE
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.accountService.removeAccount(
      new RemoveAccountDTO(id),
    );
    if (isErr(res)) {
      return res;
    }
    return res.value;
  }

  // 给后台用来重置密码的
  // TODO: 鉴权, 需要 ACCOUNT:RESET-FORCE
  @Patch('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    const res = await this.accountService.resetPassword({
      ...dto,
      force: true,
    });
    if (isErr(res)) {
      return res;
    }
    return res.value;
  }
}
