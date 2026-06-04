import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { GetActionInfoQueryHandler, ListActionQueryHandler } from './queries';
import { GetActionTotalQueryHandler } from './queries/get-action-total.query';
import { UpdateActiveCommandHandler } from './commands';
import { UpdateActionActiveAction } from './actions';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Action } from 'water-bbs-migration';

@Module({
  imports: [MikroOrmModule.forFeature([Action])],
  controllers: [ActionController],
  providers: [
    ActionService,
    GetActionInfoQueryHandler,
    GetActionTotalQueryHandler,
    ListActionQueryHandler,
    UpdateActiveCommandHandler,
    UpdateActionActiveAction,
  ],
})
export class ActionModule {}
