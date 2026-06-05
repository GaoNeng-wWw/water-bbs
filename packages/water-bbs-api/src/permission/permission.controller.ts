import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import {
  CreatePermissionDto,
  CreatePermissionResponse,
} from './dto/create-permission.dto';
import {
  RemovePermission,
  RemovePermissionResponse,
} from './dto/remove-permission.dto';
import {
  ApiPaginatedResponse,
  Pagination,
  Permission,
  UseModel,
} from '@app/shared';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { PermissionSummary } from './dto/list-permission.dto';
import { FindPermissionResponse } from './dto/find-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permission('permission.create')
  @ApiCreatedResponse({ type: CreatePermissionResponse })
  @UseModel(CreatePermissionResponse)
  @Post('')
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.permissionService.createPermission(dto);
  }

  @Permission('permission.remove')
  @ApiOkResponse({ type: RemovePermissionResponse })
  @UseModel(RemovePermissionResponse)
  @Delete('')
  removePermission(@Body() dto: RemovePermission) {
    return this.permissionService.removePermission(dto);
  }

  @Permission('permission.list')
  @Get('')
  @UseModel(Pagination)
  @ApiPaginatedResponse(PermissionSummary)
  listPermission(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    return this.permissionService.listPermission(page, size);
  }

  @Permission('permission.find')
  @ApiOkResponse({ type: FindPermissionResponse })
  @UseModel(FindPermissionResponse)
  @Get(':code')
  findPermission(@Param('code') code: string) {
    return this.permissionService.findPermission(code);
  }
}
