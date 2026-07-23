import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  CreateTaskRequest,
  CreateTaskResponse,
  FactInfo,
  FindTaskInfo,
  ListTaskResponse,
  RemoveTaskResponse,
  RewardSummary,
} from './dto';
import { UseModel, User } from '@app/shared';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('reward')
  @ApiOkResponse({
    type: [RewardSummary],
  })
  async getRewards() {
    return this.taskService.getRewards();
  }

  @Get('facts')
  @ApiOkResponse({
    type: [FactInfo],
  })
  async getFacts() {
    return this.taskService.getFacts();
  }

  @Get('')
  @UseModel(ListTaskResponse)
  @ApiOkResponse({ type: ListTaskResponse })
  async listTasks(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    return this.taskService.listTask(page, size);
  }
  @Get(':id')
  @UseModel(FindTaskInfo)
  @ApiOkResponse({ type: FindTaskInfo })
  async findTask(@Param('id') id: string, @User() user: RequestUser) {
    return this.taskService.findTask(id, user.account.id);
  }

  @Post('')
  @UseModel(CreateTaskResponse)
  @ApiCreatedResponse({ type: CreateTaskResponse })
  async createTask(@Body() body: CreateTaskRequest) {
    return this.taskService.createTask(body);
  }

  @Delete(':id')
  @UseModel(RemoveTaskResponse)
  @ApiCreatedResponse({ type: RemoveTaskResponse })
  async removeTask(@Param('id') id: string) {
    return this.taskService.removeTask(id);
  }
}
