import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { FindRole, FindRoleResponse } from './dto/find-role.dto';
import { ListRoleQuery } from './query';
import { CreateRole, CreateRoleResponse } from './dto';
import { RemoveRole, RemoveRoleResponse } from './dto/remove-role.dto';
import {
  UpdateRole,
  UpdateRoleParam,
  UpdateRoleResponse,
} from './dto/update-role.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  ApiPaginatedResponse,
  Pagination,
  Permission,
  UseModel,
} from '@app/shared';
import { RoleSummary } from './dto/list-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Permission('role.create')
  @UseModel(CreateRoleResponse)
  @ApiCreatedResponse({ type: CreateRoleResponse })
  @Post('')
  createRole(@Body() dto: CreateRole) {
    return this.roleService.createRole(dto);
  }

  @Permission('role.remove')
  @UseModel(RemoveRoleResponse)
  @ApiOkResponse({ type: RemoveRoleResponse })
  @Delete(':id')
  removeRole(@Param() dto: RemoveRole) {
    return this.roleService.removeRole(dto);
  }

  @Permission('role.update')
  @UseModel(UpdateRoleResponse)
  @ApiOkResponse({ type: UpdateRoleResponse })
  @Patch(':id')
  updateRole(@Param() param: UpdateRoleParam, @Body() dto: UpdateRole) {
    return this.roleService.updateRole(param.id, dto);
  }

  @Permission('role.list')
  @UseModel(Pagination)
  @ApiPaginatedResponse(RoleSummary)
  @Get('')
  listRole(@Query() dto: ListRoleQuery) {
    return this.roleService.listRole(dto);
  }

  @Permission('role.find')
  @UseModel(FindRoleResponse)
  @ApiOkResponse({ type: FindRoleResponse })
  @Get(':code')
  findRole(@Param() dto: FindRole) {
    return this.roleService.findRole(dto);
  }
}
