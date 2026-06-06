import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import {
  CreateRoleCommandHandler,
  RemoveRoleCommandHandler,
  UpdateRoleCommandHandler,
} from './command';
import { FindRoleHandler, ListRoleHandler } from './query';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Permission, Role } from 'water-bbs-migration';

@Module({
  imports: [MikroOrmModule.forFeature([Role, Permission])],
  controllers: [RoleController],
  providers: [
    RoleService,
    CreateRoleCommandHandler,
    UpdateRoleCommandHandler,
    RemoveRoleCommandHandler,
    ListRoleHandler,
    FindRoleHandler,
  ],
})
export class RoleModule {}
