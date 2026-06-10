import { Public, User } from '@app/shared';
import { Controller, Get, Param } from '@nestjs/common';
import { AppSerivce } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appSer: AppSerivce) {}
  @Public()
  @Get('asset/:id')
  getAsset(@Param('id') id: string, @User() user?: RequestUser) {
    return this.appSer.getAssert(id);
  }
}
