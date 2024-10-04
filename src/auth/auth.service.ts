import { HttpException, Injectable } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.model';
import * as process from 'process';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private telegramBotService: TelegramBotService,
  ) {}

  async authUser(dto: AuthUserDto) {
    const user = await this.usersService.getUserById(dto.tg_init_data);
    let token = null;

    if (user) {
      token = await this.generateToken(user);
    } else {
      const newUser = await this.usersService.createUser(dto);
      token = await this.generateToken(newUser);
    }
    return token;
  }

  private async generateToken(user: User) {
    const payload = {
      uuid: user.uuid,
      firstName: user.first_name,
      userName: user.username,
    };
    return this.jwtService.sign(payload);
  }

  private async getInitData(data: { tg_init_data: string; ref: string }) {
    const { tg_init_data, ref } = data;
    const decodedString = decodeURIComponent(tg_init_data);
    const params = new URLSearchParams(decodedString);
    const userData = JSON.parse(params.get('user'));
    const chatInstance = JSON.parse(params.get('chat_instance'));

    return {
      userData,
      chatInstance,
      ref,
    };
  }

  async login(dto: AuthUserDto) {
    const data = await this.getInitData(dto);
    const user = await this.usersService.getUserByTelegramId(
      data.userData.id.toString(),
    );



    if (user) {
      return {
        token: await this.generateToken(user),
        user: user,
      };
    }

    return process.env.CREATE_USER_VIA_REF_ONLY === 'true'
      ? await this.createUserViaRefOnly(data)
      : await this.createUser(data);
  }

  private async createUser(data: any) {
    const userData = { ...data.userData, id: data.userData.id };
    const user = await this.usersService.createUser(userData);
    const token = await this.generateToken(user);

    return {
      token,
      user,
    };
  }

  private async sendMessageToParent(parent: User, userName: string) {
    const { id } = parent;

    await this.telegramBotService.sendMessage(
      id,
      `Finally! ${userName} has joined your team on WeWeTap!`,
    );
  }

  private async createUserViaRefOnly(data: any) {
    const parent = await this.usersService.getUserById(data.ref);

    if (!parent || !data.ref) {
      throw new HttpException('User not Found', 422);
    }
    if (parent.asgardians_count === parent.max_invites_count) {
      throw new HttpException('Maximum invites reached', 429);
    }
    await this.sendMessageToParent(parent, data.userData.username);

    parent.asgardians_count += 1;
    await parent.save();

    const userData = {
      ...data.userData,
      id: data.userData.id,
      parent_id: parent.uuid,
    };

    const user = await this.usersService.createUser(userData);

    const token = await this.generateToken(user);

    return {
      token,
      user,
    };
  }

  async getMe(data) {
    const token = data.headers['accesstoken'].split(' ')[1];
    const { uuid } = this.jwtService.decode(token);
    return {
      user: await this.usersService.getUserById(uuid),
    };
  }
}
