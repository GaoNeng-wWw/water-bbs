import { Public, User } from '@app/shared';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { AppSerivce } from './app.service';
import { isErr, ok } from 'water-bbs-shared';
import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appSer: AppSerivce) {}
  @Public()
  @Get('assets/:id')
  async getAsset(
    @Param('id') id: string,
    @Res() res: Response,
    @User() user?: RequestUser,
  ) {
    const resp = await this.appSer.getAsset(id);
    if (isErr(resp)) {
      return resp;
    }
    const { data } = resp.value;
    if (!data || !data.value) {
      throw new HttpException('ASSERT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Disposition', 'inline'); // 显示
    res.send(data.value);
    return ok(true);
  }
}
