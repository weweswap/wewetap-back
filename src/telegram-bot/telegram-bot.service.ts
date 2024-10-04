import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as process from 'process';
import { join } from 'path';
import { asgr_phrases } from '../config';

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: TelegramBot;

  onModuleInit(): any {
    this.initTelegramBot();
  }

  private initTelegramBot() {
    const token = process.env.BOT_TOKEN;
    this.bot = new TelegramBot(token, { polling: true });

    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      switch (text) {
        case '/start':
          this.onStart(chatId);
          break;
        default:
          this.bot.sendMessage(chatId, `Вы написали: ${text}`);
          break;
      }

      // Обработайте текст и отправьте ответ
    });
  }

  private onStart(chatId: number) {
    const options = {
      caption:
        'You are here to witness the awesomeness that is about to unfold. And by awesomeness, I mean chaos. Pure, glorious chaos 💥\n' +
        '\n' +
        "But hey, that's what you get when you let the God of Mischief run the show, am I right? I promise it'll be a blast, just keep your wits about you and don't trust anything you see. Especially if it looks like it came from Asgardian IKEA - those instructions are impossible to follow.\n" +
        '\n' +
        "So buckle up, strap in, and get ready for a ride that's guaranteed to be full of twists, turns, and maybe even a few pranks along the way.\n" +
        '\n' +
        'And remember, if things get too out of hand, just blame it on Thor. \n' +
        "He's used to it by now. 🙃",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Launch WeWeTap',
              url: 'https://t.me/wewetapbot/app',
            },
          ],
          [
            {
              text: 'Join community',
              url: 'https://t.me/wewetap',
            },
          ],
        ],
      },
    };

    const filePath = join(__dirname, '..', '..', 'assets', 'img', 'start.jpg');
    this.bot.sendPhoto(chatId, filePath, options);
  }

  sendMessage(chatId: string, message: string, options = {}) {
    return this.bot.sendMessage(chatId, message, options);
  }

  //TODO вынести в отделное мб
  sendAssgariansClaimMessage(chatId: string, username: string) {
    const randomIndex = Math.floor(Math.random() * asgr_phrases.length);
    const randomWord = asgr_phrases[randomIndex];

    return this.bot.sendMessage(chatId, `🩸 *${username}* : ${randomWord}`, {
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
  }
}
