import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ActionService } from './action.service';
import { UpdateActive, UpdateActiveResponse } from './dto/update-active.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UseModel } from '@app/shared';
import { ActionTotal } from './entity/action-total';
import { ActionInfo } from './entity/action-info';
import { ActionList } from './entity/action-list';

@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @ApiOkResponse({ type: ActionTotal })
  @UseModel(ActionTotal)
  @Get('total')
  async getActionTotal() {
    return this.actionService.getActionTotal();
  }

  @ApiOkResponse({ type: ActionInfo })
  @UseModel(ActionInfo)
  @Get(':id')
  async getActionInfo(@Param('id') id: string) {
    return this.actionService.getActionInfo(id);
  }

  @ApiOkResponse({ type: ActionList })
  @UseModel(ActionList)
  @Get()
  async listAction() {
    return this.actionService.listAction();
  }

  @ApiOkResponse({ type: UpdateActiveResponse })
  @UseModel(UpdateActiveResponse)
  @Patch(':id')
  async updateActive(@Param('id') id: string, @Body() body: UpdateActive) {
    return this.actionService.updateActive(id, body);
  }
}
