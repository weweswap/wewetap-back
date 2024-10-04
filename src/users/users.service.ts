import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';

import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import * as moment from 'moment';
import { getRandomInteger } from '../helpers/getRandomInteger';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { asgr_phrases, kik_phrases } from '../config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService,
    private telegramBotService: TelegramBotService,
  ) {
    this.userRepository = userRepository;
  }

  async createUser(dto: AuthUserDto) {
    return await this.userRepository.create(dto);
  }

  async getUserById(userId: string) {
    return await this.userRepository.findOne({
      where: { uuid: userId },
    });
  }

  async getUserByTelegramId(userId: string) {
    const user = await this.userRepository.findOne({
      raw: true,
      where: { id: userId },
      attributes: { exclude: ['parent_id', 'externalUrl', 'walletAddress'] },
    });
    if (user) {
      return user;
    }
  }

  async getAll(skip: number = 0, take: number = 10) {
    return await this.userRepository.findAll({ limit: take, offset: skip });
  }

  async updateUserWallet(wallet: string, req: any) {
    const token = req.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);
    let user = await this.userRepository.findOne({ where: { uuid: uuid } });
    user.wallet_address = wallet;
    user = await user.save();

    return {
      user: user,
    };
  }

  async getUserReferals(req: any, skip: number = 0, take: number = 10) {
    const token = req.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);
    const totalCount = await this.userRepository.count({
      where: { parent_id: uuid },
    });
    const userReferals = await this.userRepository.findAll({
      where: { parent_id: uuid },
      limit: take,
      offset: skip,
      order: [['coins', 'DESC']],
    });
    return {
      total: totalCount,
      items: userReferals,
    };
  }

  private getClaimMinutesCount(): number {
    return parseInt(process.env.DEFAULT_CLAIM_MINUTES_COUNT, 10);
  }

  private getClaimCoinsCount(level: number = 0): number {
    switch (level) {
      case 0:
        return parseFloat(process.env.DEFAULT_CLAIM_COINS_COUNT);
      case 1:
        return (
          (parseFloat(process.env.DEFAULT_CLAIM_COINS_COUNT) *
            parseInt(process.env.ASGARDIANS_LEVEL_1_ROYALTY, 10)) /
          100
        );
      case 2:
        return (
          (parseFloat(process.env.DEFAULT_CLAIM_COINS_COUNT) *
            parseFloat(process.env.ASGARDIANS_LEVEL_2_ROYALTY)) /
          100
        );
    }
  }

  private getPlaneGamePassCount(minCount: number, maxCount: number): number {
    return getRandomInteger(minCount, maxCount);
  }

  private async claimParentCoins(
    id: string,
    level: number = 1,
    userName: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { uuid: id } });
    if (!user) return;
    if (user.asgardians_coins === 0) {
      this.telegramBotService.sendAssgariansClaimMessage(user.id, userName);
    }
    user.asgardians_coins += this.getClaimCoinsCount(level);
    await user.save();
  }

  async claimCoins(req: any): Promise<{ user: User }> {
    const token = req.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);
    const user = await this.getUserById(uuid);

    if (user.parent_id) {
      await this.claimParentCoins(user.parent_id, 1, user.username);
    }

    const lastClaimTime = moment(user.last_default_claim_datetime);
    const claimMinutesCount = this.getClaimMinutesCount();
    const claimTimeLimit = lastClaimTime.add(claimMinutesCount, 'minute');

    if (claimTimeLimit.isAfter(moment())) {
      throw new HttpException(
        'Not Enough Time',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const newCoinsCount = user.coins + this.getClaimCoinsCount(0);
    const newPlaneGamePassCount =
      user.plane_game_pass_count +
      this.getPlaneGamePassCount(
        parseInt(process.env.DEFAULT_CLAIM_MIN_PLANE_GAME_PASS_COUNT, 10),
        parseInt(process.env.DEFAULT_CLAIM_MAX_PLANE_GAME_PASS_COUNT, 10),
      );

    user.coins = newCoinsCount;
    user.last_default_claim_datetime = moment().toDate();
    user.plane_game_pass_count = newPlaneGamePassCount;
    const updUser = await user.save();

    return {
      user: updUser,
    };
  }

  async claimAsgardianCoins(req: any) {
    const token = req.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);
    const user = await this.getUserById(uuid);
    if (user.asgardians_coins === 0) {
      throw new HttpException(
        'Not Enough Coins',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const lastClaimTime = moment(user.last_asgardians_claim_datetime);
    const claimMinutesCount = parseInt(
      process.env.ASGARDIANS_CLAIM_MINUTES_COUNT,
      10,
    );
    const claimTimeLimit = lastClaimTime.add(claimMinutesCount, 'minute');

    if (claimTimeLimit.isAfter(moment())) {
      throw new HttpException(
        'Not Enough Time',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    user.coins = user.coins + user.asgardians_coins;
    user.asgardians_coins = 0;
    user.last_asgardians_claim_datetime = moment().toDate();

    const updUser = await user.save();
    return {
      user: updUser,
    };
  }

  async kickUser(req: any, user_id: string) {
    const token = req.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);
    const user = await this.userRepository.findOne({
      where: { uuid: user_id },
    });
    if (user.parent_id !== uuid) {
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const parent = await this.userRepository.findOne({ where: { uuid } });
    if (parent.coins < parseInt(process.env.KICK_COST)) {
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    parent.coins = parent.coins - parseInt(process.env.KICK_COST);
    await parent.save();
    const randomIndex = Math.floor(Math.random() * kik_phrases.length);
    const message = `💥 *${parent.username}* : ${kik_phrases[randomIndex]}`;
    await this.telegramBotService.sendMessage(user.id, message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Launch WeWeTap',
              url: 'https://t.me/wewetapbot/app',
            },
          ],
        ],
      },
      parse_mode: 'Markdown',
    });
    return {
      user: parent,
    };
  }
}
