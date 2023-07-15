import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeTodos } from 'src/types/types';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getAllTask() {
    return await this.taskRepository.find();
  }

  async createTask(name: string) {
    const task = this.taskRepository.create({ name });

    await this.taskRepository.save(task);
    return this.getAllTask();
  }

  async getTaskById(id: number) {
    return await this.taskRepository.findOneBy({ id });
  }

  async completeTask(id: number) {
    const task = await this.getTaskById(id);

    if (!task) return null;

    task.isCompleted = !task.isCompleted;
    await this.taskRepository.save(task);
    return this.getAllTask();
  }

  async editTask(id: number, name: string) {
    const task = await this.getTaskById(id);

    if (!task) return null;

    task.name = name;
    await this.taskRepository.save(task);
    return await this.getAllTask();
  }

  async deleteTask(id: number) {
    const task = await this.getTaskById(id);

    if (!task) return null;

    await this.taskRepository.delete({ id });
    return this.getAllTask();
  }

  getAllList(todos) {
    return `
    Your list what to do:\n\n${todos
      .map((todo: TypeTodos) =>
        todo.isCompleted
          ? `✅ ${todo.name} ${'\n\n'}`
          : `🔘 ${todo.name} ${'\n\n'}`,
      )
      .join(' ')}
    `;
  }
}
