import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { Permission } from 'water-bbs-migration';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  CreatePermissionCommandHandler,
  RemovePermissionCommandHandler,
} from './commands';
import { FindPermissionHandler, ListPermissionHandler } from './query';

@Module({
  imports: [MikroOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    CreatePermissionCommandHandler,
    RemovePermissionCommandHandler,
    ListPermissionHandler,
    FindPermissionHandler,
  ],
})
export class PermissionModule {}
