import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskRequest, ListTaskRequest, ListTaskResponse } from './dto';
import { UseModel, User } from '@app/shared';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get('')
  @UseModel(ListTaskResponse)
  async listTasks(@Query() query: ListTaskRequest) {
    return this.taskService.listTask(query.page, query.size);
  }
  @Get(':id')
  async findTask(@Param('id') id: string, @User() user: RequestUser) {
    return this.taskService.findTask(id, user.account.id);
  }

  @Post('')
  async createTask(@Body() body: CreateTaskRequest) {
    return this.taskService.createTask(body);
  }

  @Delete(':id')
  async removeTask(@Param('id') id: string) {
    return this.taskService.removeTask(id);
  }
}
