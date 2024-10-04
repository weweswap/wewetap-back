import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Task } from './task.model';
import { RemoveTaskDto } from './dto/remove-task.dto';
import { ApiGuard } from '../guards/api/api.guard';

@ApiTags('Tasks')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(ApiGuard)
  @ApiOperation({ summary: 'Create Task' })
  @ApiResponse({ status: 200, type: Task })
  @Post('create')
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  @UseGuards(ApiGuard)
  @ApiOperation({ summary: 'Create many Task ' })
  @ApiResponse({ status: 200, type: [Task] })
  @Post('createMany')
  createMany(@Body() dto: CreateTaskDto[]) {
    return this.taskService.createManyTasks(dto);
  }

  @Post('list')
  @HttpCode(200)
  getAllTasks(@Body('skip') skip: number = 0, @Body('take') take: number = 10) {
    return this.taskService.getAllTasks(skip, take);
  }

  @Post('start')
  @HttpCode(200)
  startTask(@Body('task_id') task_id: string, @Req() req) {
    return this.taskService.startTask(req, task_id);
  }

  @Post('my')
  @HttpCode(200)
  getUserTasks(
    @Req() req,
    @Body('skip') skip: number = 0,
    @Body('take') take: number = 10,
  ) {
    return this.taskService.getUserTasks(req, skip, take);
  }

  @Post('end')
  @HttpCode(200)
  endTask(@Body('task_id') task_id: string, @Req() req) {
    return this.taskService.endTask(req, task_id);
  }

  @Post('remove')
  @UseGuards(ApiGuard)
  @HttpCode(200)
  @ApiBody({ type: RemoveTaskDto })
  removeTask(@Body() removeTaskDto: RemoveTaskDto, @Req() req) {
    return this.taskService.deleteTask(req, removeTaskDto.task_id);
  }
}
