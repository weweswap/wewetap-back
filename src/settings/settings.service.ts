import { Injectable } from '@nestjs/common';
import { SettingsDto } from './dto/settings.dto';
import * as process from 'process';

@Injectable()
export class SettingsService {
  async getSettings(): Promise<SettingsDto> {
    return {
      MAX_INVITES_COUNT: parseInt(process.env.MAX_INVITES_COUNT),
      DEFAULT_CLAIM_COINS_COUNT: parseFloat(
        process.env.DEFAULT_CLAIM_COINS_COUNT,
      ),
      DEFAULT_CLAIM_MINUTES_COUNT: parseInt(
        process.env.DEFAULT_CLAIM_MINUTES_COUNT,
      ),
      ASGARDIANS_CLAIM_MINUTES_COUNT: parseInt(
        process.env.ASGARDIANS_CLAIM_MINUTES_COUNT,
      ),
      ASGARDIANS_LEVEL_1_ROYALTY: parseInt(
        process.env.ASGARDIANS_LEVEL_1_ROYALTY,
      ),
      ASGARDIANS_LEVEL_2_ROYALTY: parseInt(
        process.env.ASGARDIANS_LEVEL_2_ROYALTY,
      ),
      ASGARDIANS_MAX_TAKE: parseInt(process.env.ASGARDIANS_MAX_TAKE),
      ASGARDIANS_DEFAULT_TAKE: parseInt(process.env.ASGARDIANS_DEFAULT_TAKE),
      TASKS_DEFAULT_TAKE: parseInt(process.env.TASKS_DEFAULT_TAKE),
      TASKS_MAX_TAKE: parseInt(process.env.TASKS_MAX_TAKE),
      KICK_COST: parseInt(process.env.KICK_COST),
    };
  }
}
