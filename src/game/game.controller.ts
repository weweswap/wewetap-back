import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';

@ApiTags('game')
@Controller()
export class GameController {
  constructor(private gameService: GameService) {
    this.gameService = gameService;
  }

  @Post('planegame/start')
  @HttpCode(200)
  async startGame(@Req() req) {
    return await this.gameService.gameStart(req);
  }

  @Post('planegame/end')
  @HttpCode(200)
  async endGame(@Body('points') points: number, @Req() req) {
    return await this.gameService.gameEnd(req, points);
  }
}
