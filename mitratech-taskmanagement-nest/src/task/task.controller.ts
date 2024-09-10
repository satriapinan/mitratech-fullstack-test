import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { isValidObjectId } from 'mongoose';

@Controller('tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks() {
    this.logger.log('Fetching all tasks');
    const tasks = await this.taskService.getAllTasks();
    return {
      statusCode: HttpStatus.OK,
      message: 'Tasks retrieved successfully',
      data: tasks,
    };
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    this.logger.log(`Fetching task with ID ${id}`);
    if (!isValidObjectId(id)) {
      this.logger.warn(`Invalid task ID: ${id}`);
      throw new NotFoundException(`Task with ID ${id} is not valid`);
    }

    const task = await this.taskService.getTaskById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Task retrieved successfully',
      data: task,
    };
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    this.logger.log(`Creating new task: ${createTaskDto.name}`);
    const task = await this.taskService.createTask(createTaskDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Task created successfully',
      data: task,
    };
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    this.logger.log(`Updating task with ID ${id}`);
    if (!isValidObjectId(id)) {
      this.logger.warn(`Invalid task ID: ${id}`);
      throw new NotFoundException(`Task with ID ${id} is not valid`);
    }

    const task = await this.taskService.updateTask(id, updateTaskDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Task updated successfully',
      data: task,
    };
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    this.logger.log(`Deleting task with ID ${id}`);
    if (!isValidObjectId(id)) {
      this.logger.warn(`Invalid task ID: ${id}`);
      throw new NotFoundException(`Task with ID ${id} is not valid`);
    }

    await this.taskService.deleteTask(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Task deleted successfully',
      data: null,
    };
  }
}
