import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/users.model';
import { TaskStatus, UserTaskModel } from '../user-task/user-task.model';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private taskRepository: typeof Task,
    @InjectModel(UserTaskModel)
    private userTaskRepository: typeof UserTaskModel,
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService,
    private telegramBotService: TelegramBotService,
  ) {}

  async createTask(dto: CreateTaskDto) {
    return await this.taskRepository.create(dto);
  }

  async deleteTask(req: any, id: string) {
    return await this.taskRepository.destroy({ where: { id: id } });
  }

  async createManyTasks(dto: CreateTaskDto[]) {
    return await this.taskRepository.bulkCreate(dto, { returning: true });
  }

  async getAllTasks(skip: number = 0, take: number = 10) {
    const items = await this.taskRepository.findAll({
      limit: take,
      offset: skip,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['updatedAt', 'createdAt'] },
    });
    return {
      total: items.length,
      items,
    };
  }

  async startTask(req: any, task_id: string) {
    const token = req.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);
    const task = await this.userTaskRepository.findOne({
      where: { user_id: uuid, task_id: task_id },
    });
    if (!task) {
      const newTask = await this.userTaskRepository.create({
        user_id: uuid,
        task_id: task_id,
      });
      const taskData = newTask.get({ plain: true });
      delete taskData.createdAt;
      delete taskData.updatedAt;
      return taskData;
    } else {
      throw new HttpException(
        'User already has this task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getParentTaskCoins(level: number = 1, coins: number): number {
    switch (level) {
      case 1:
        return (
          (coins * parseInt(process.env.ASGARDIANS_LEVEL_1_ROYALTY, 10)) / 100
        );
      case 2:
        return (
          (coins * parseFloat(process.env.ASGARDIANS_LEVEL_2_ROYALTY)) / 100
        );
    }
  }

  private async updateUserCoins(userId: string, coins: number) {
    const user = await this.userRepository.findOne({ where: { uuid: userId } });
    await this.userRepository.update(
      { coins: user.coins + coins },
      { where: { uuid: userId } },
    );
  }

  private async updateUserParentsCoins(
    userId: string,
    coins: number,
    level: number = 1,
    username: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { uuid: userId },
    });

    if (!user) return;
    if (user.asgardians_coins === 0) {
      await this.telegramBotService.sendAssgariansClaimMessage(
        user.id,
        username,
      );
    }
    user.asgardians_coins += this.getParentTaskCoins(level, coins);

    await user.save();
  }

  async endTask(req: any, task_id: string) {
    const token = req.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);
    const user = await this.userRepository.findOne({ where: { uuid: uuid } });

    const task = await this.userTaskRepository.findOne({
      where: { user_id: uuid, task_id: task_id },
    });

    const claimTime = moment(task.createdAt).add(
      process.env.TASK_MIN_CLAIM_SECOND_DELAY,
      'seconds',
    );
    if (!task) {
      throw new HttpException(
        'User does not have this task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (claimTime.isAfter(moment())) {
      throw new HttpException(
        'Not enough time',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (task.status === TaskStatus.done) {
      throw new HttpException(
        'User already has this task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    await this.userTaskRepository.update(
      { status: TaskStatus.done },
      { where: { user_id: uuid, task_id: task_id } },
    );
    const taskData = task.get({ plain: true });
    const { coins } = await this.taskRepository.findOne({
      where: { id: taskData.task_id },
    });
    taskData.status = TaskStatus.done;
    delete taskData.createdAt;
    delete taskData.updatedAt;

    if (user.parent_id) {
      await this.updateUserParentsCoins(
        user.parent_id,
        coins,
        1,
        user.username,
      );
    }

    await this.updateUserCoins(uuid, coins);

    return taskData;
  }

  async getUserTasks(req: any, skip: number = 0, take: number = 10) {
    const token = req.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);

    const userTasks = await this.userTaskRepository.findAll({
      where: { user_id: uuid },
      limit: take,
      offset: skip,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['updatedAt', 'createdAt'] },
    });
    return {
      total: userTasks.length,
      items: userTasks,
    };
  }
}
