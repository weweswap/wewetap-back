import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {
    this.authService = authService;
  }

  @Post('/user/login')
  @HttpCode(200)
  login(@Body() dto: AuthUserDto) {
    return this.authService.login(dto);
  }

  @Post('/user/me')
  @HttpCode(200)
  getMe(@Req() req) {
    return this.authService.getMe(req);
  }
}
