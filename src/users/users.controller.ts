import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { ApiGuard } from '../guards/api/api.guard';

@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Create User' })
  @Post('auth')
  createUser(@Body() dto: AuthUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(ApiGuard)
  @ApiOperation({ summary: 'Get User' })
  @HttpCode(200)
  @Get('all')
  getAll(@Query('skip') skip: number = 0, @Query('take') take: number = 10) {
    return this.userService.getAll(skip, take);
  }

  @ApiOperation({ summary: 'Change wallet' })
  @HttpCode(200)
  @Post('/wallet')
  updateUserWallet(@Body('wallet_address') wallet: string, @Req() reg) {
    return this.userService.updateUserWallet(wallet, reg);
  }

  @ApiOperation({ summary: 'get ref' })
  @HttpCode(200)
  @Post('/asgardians')
  getUserReferals(
    @Body('skip') skip: number = 0,
    @Body('take') take: number = 10,
    @Req() req,
  ) {
    return this.userService.getUserReferals(req, skip, take);
  }

  @ApiOperation({ summary: 'Claim' })
  @Post('/claim')
  @HttpCode(200)
  claimCoins(@Req() req) {
    return this.userService.claimCoins(req);
  }

  @ApiOperation({ summary: 'Parent Claim' })
  @Post('/asgardiansclaim')
  @HttpCode(200)
  claimParentCoins(@Req() req) {
    return this.userService.claimAsgardianCoins(req);
  }

  @ApiOperation({ summary: 'Kick ref ' })
  @Post('/kick')
  @HttpCode(200)
  kickUser(@Req() req, @Body('id') user_id: string) {
    return this.userService.kickUser(req, user_id);
  }
}
