import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetActionInfoQuery, GetActionTotalQuery, ListAction } from './queries';
import { UpdateActive } from './dto/update-active.dto';
import { UpdateActiveCommand } from './commands';

@Injectable()
export class ActionService {
  constructor(
    private readonly qb: QueryBus,
    private readonly cb: CommandBus,
  ) {}
  async listAction() {
    return this.qb.execute(new ListAction());
  }
  async getActionTotal() {
    return this.qb.execute(new GetActionTotalQuery());
  }
  async getActionInfo(id: string) {
    return this.qb.execute(new GetActionInfoQuery(id));
  }
  async updateActive(id: string, updateActive: UpdateActive) {
    return this.cb.execute(new UpdateActiveCommand(id, updateActive.active));
  }
}
