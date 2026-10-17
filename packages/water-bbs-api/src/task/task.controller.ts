import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  CancelTaskResponse,
  ClaimTaskResponse,
  CreateTaskDto,
  CreateTaskResponse,
  DeliverTaskResponse,
  GetTaskListResponseItem,
  RemoveTaskResponse,
  TaskDetailResponse,
  TaskProgressResponse,
} from './dto';
import schema from '@app/gamification/task/schema/core';
import { err } from 'neverthrow';
import { Member, MemberKind, type TaskID } from '@app/gamification';
import { ApiCursorPagination, CursorDTO } from '@app/shared';
import { type AccountId, User } from 'src/auth';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({
    summary: '创建任务',
    operationId: 'createTask',
    description: '只有bd或admin才有权限创建任务',
  })
  @ApiCreatedResponse({ description: '创建任务成功', type: CreateTaskResponse })
  @Member(MemberKind.BD)
  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    const { success, data, error } = schema.safeParse(dto.schema);
    if (!success) {
      return err(error);
    }
    return this.taskService.createTask({ schema: data });
  }

  @ApiOperation({
    summary: '删除任务',
    operationId: 'removeTask',
    description: '只有bd或admin才有权限删除任务',
  })
  @ApiParam({ name: 'id', description: '任务ID' })
  @ApiCreatedResponse({ description: '删除任务成功', type: RemoveTaskResponse })
  @Member(MemberKind.BD)
  @Delete(':id')
  removeTask(@Param('id') id: TaskID) {
    return this.taskService.removeTask({ id });
  }

  @ApiOperation({ summary: '获取任务列表', operationId: 'getTasks' })
  @ApiCursorPagination(GetTaskListResponseItem)
  @ApiQuery({ type: CursorDTO })
  @Get()
  getTasks(@Query() query: CursorDTO, @User('id') accountID: AccountId) {
    return this.taskService.listTask(query, accountID);
  }

  @ApiOperation({ summary: '获取任务详情', operationId: 'getTaskDetail' })
  @ApiOkResponse({ description: '获取任务详情', type: TaskDetailResponse })
  @Get(':id')
  getTaskDetail(@Param('id') id: TaskID, @User('id') accountID: AccountId) {
    return this.taskService.getTaskDetail(id, accountID);
  }

  @ApiOperation({
    summary: '获取任务进度',
    operationId: 'getTaskProgress',
    description: '获取任务进度, 如果没有领取任务会返回404',
  })
  @ApiOkResponse({
    description: '获取任务进度',
    type: TaskProgressResponse,
  })
  @ApiParam({ name: 'id', description: '任务ID' })
  @Get(':id/progress')
  getTaskProgress(@Param('id') id: TaskID, @User('id') accountID: AccountId) {
    return this.taskService.getTaskProgress(id, accountID);
  }

  @ApiOperation({ summary: '领取任务', operationId: 'claimTask' })
  @ApiCreatedResponse({
    description: '领取任务成功返回',
    type: ClaimTaskResponse,
  })
  @ApiParam({ name: 'id', description: '任务ID' })
  @Post(':id/claim')
  claimTask(@Param('id') id: TaskID, @User('id') accountID: AccountId) {
    return this.taskService.claimTask(id, accountID);
  }
  @ApiOperation({
    summary: '取消任务',
    operationId: 'cancelTask',
    description: '取消任务, 如果没有领取任务会返回404',
  })
  @ApiCreatedResponse({
    description: '取消任务成功返回',
    type: CancelTaskResponse,
  })
  @Post(':id/cancel')
  cancelTask(@Param('id') id: TaskID, @User('id') accountID: AccountId) {
    return this.taskService.cancelTask(id, accountID);
  }
  @ApiOperation({
    summary: '交付任务',
    operationId: 'deliverTask',
    description: '交付任务, 如果没有领取任务会返回404',
  })
  @ApiCreatedResponse({
    description: '交付任务成功返回',
    type: DeliverTaskResponse,
  })
  @ApiParam({ name: 'id', description: '任务ID' })
  @Post(':id/deliver')
  deliverTask(@Param('id') id: TaskID, @User('id') accountID: AccountId) {
    return this.taskService.deliverTask(id, accountID);
  }
}
