import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ReferalsModule } from './referals/referals.module';
import { User } from './users/users.model';
import { TaskModule } from './task/task.module';
import { Task } from './task/task.model';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { UserTaskModule } from './user-task/user-task.module';
import { UserTaskModel } from './user-task/user-task.model';
import { GameModule } from './game/game.module';
import { LogModule } from './log/log.module';
import { Log } from './log/log.model';
import { ConfigModule } from '@nestjs/config';

import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import * as process from 'process';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Task, User, UserTaskModel, Log],
      autoLoadModels: true,
    }),
    UsersModule,
    ReferalsModule,
    TaskModule,
    AuthModule,
    SettingsModule,
    UserTaskModule,
    GameModule,
    LogModule,
    TelegramBotModule,
  ],
})
export class AppModule {}
