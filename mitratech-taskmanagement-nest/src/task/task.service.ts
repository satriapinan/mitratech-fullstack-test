import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getAllTasks(): Promise<Task[]> {
    this.logger.log('Fetching all tasks from the database');
    return await this.taskModel.find().exec();
  }

  async getTaskById(id: string): Promise<Task> {
    this.logger.log(`Fetching task with ID ${id} from the database`);
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      this.logger.warn(`Task with ID ${id} not found`);
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.log(`Creating a new task with name '${createTaskDto.name}'`);
    const existingTask = await this.taskModel
      .findOne({ name: createTaskDto.name })
      .exec();

    if (existingTask) {
      this.logger.warn(`Task with name '${createTaskDto.name}' already exists`);
      throw new ConflictException(
        `Task with name '${createTaskDto.name}' already exists`,
      );
    }

    const newTask = new this.taskModel(createTaskDto);
    return await newTask.save();
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    this.logger.log(`Updating task with ID ${id}`);
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    if (!updatedTask) {
      this.logger.warn(`Task with ID ${id} not found`);
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    this.logger.log(`Deleting task with ID ${id}`);
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      this.logger.warn(`Task with ID ${id} not found`);
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
