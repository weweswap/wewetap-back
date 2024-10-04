import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { JwtService } from '@nestjs/jwt';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';

@Module({
  controllers: [GameController],
  providers: [GameService, UsersService, JwtService],
  imports: [SequelizeModule.forFeature([User]), TelegramBotModule],
})
export class GameModule {}
