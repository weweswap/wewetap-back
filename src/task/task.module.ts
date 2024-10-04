import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './task.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { UserTaskModel } from '../user-task/user-task.model';
import { JwtService } from '@nestjs/jwt';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { ApiGuard } from '../guards/api/api.guard';

@Module({
  controllers: [TaskController],
  providers: [TaskService, JwtService, ApiGuard],
  imports: [
    SequelizeModule.forFeature([Task, User, UserTaskModel]),
    TelegramBotModule,
  ],
})
export class TaskModule {}
