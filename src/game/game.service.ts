import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import * as moment from 'moment';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService,
    private telegramBotService: TelegramBotService,
  ) {}

  private async updateUserGameStatus(user) {
    user.plane_game_pass_count -= 1;
    user.last_plane_game_datetime = moment();
    const updatedUser = await user.save();
    return {
      user: updatedUser,
    };
  }

  private async updateUserPoints(user, points) {
    user.coins += points;
    const updatedUser = await user.save();
    return {
      user: updatedUser,
    };
  }

  private getParrentAsgardiansPoints(points: number, level: number = 1) {
    switch (level) {
      case 1:
        return (
          (points * parseInt(process.env.ASGARDIANS_LEVEL_1_ROYALTY, 10)) / 100
        );
      case 2:
        return (
          (points * parseFloat(process.env.ASGARDIANS_LEVEL_2_ROYALTY)) / 100
        );
    }
  }

  private async updateParentUserCoins(
    id: string,
    points: number,
    level: number = 1,
    userName: string,
  ) {
    const user = await this.userRepository.findOne({ where: { uuid: id } });
    if (!user) return;
    if (user.asgardians_coins === 0) {
      this.telegramBotService.sendAssgariansClaimMessage(user.id, userName);
    }
    user.asgardians_coins += this.getParrentAsgardiansPoints(points, level);
    await user.save();
  }

  async gameStart(req: any) {
    const token = req.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);
    const user = await this.userRepository.findOne({ where: { uuid: uuid } });
    if (user.plane_game_pass_count == 0) {
      throw new HttpException(
        'User does not have plane game pass',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return;
    }
    return await this.updateUserGameStatus(user);
  }

  async gameEnd(req, points) {
    const token = req.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);
    const user = await this.userRepository.findOne({ where: { uuid: uuid } });
    if (user.parent_id) {
      await this.updateParentUserCoins(
        user.parent_id,
        points,
        1,
        user.username,
      );
    }
    return await this.updateUserPoints(user, points);
  }
}
