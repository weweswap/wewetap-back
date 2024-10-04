import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { Task } from '../task/task.model';
import { UserTaskModel } from '../user-task/user-task.model';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { ApiGuard } from '../guards/api/api.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, ApiGuard],
  imports: [
    SequelizeModule.forFeature([User, Task, UserTaskModel]),
    TelegramBotModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
