import { ApiProperty } from '@nestjs/swagger';

export class SettingsDto {
  @ApiProperty({
    description:
      'The maximum number of invites available to a regular user , 10',
    example: 10,
  })
  readonly MAX_INVITES_COUNT: number;

  @ApiProperty({
    description: 'The number of coins that can be minted,',
    example: 52.7,
  })
  readonly DEFAULT_CLAIM_COINS_COUNT: number;

  @ApiProperty({
    description: 'Minimum number of minutes between stamps',
    example: 480,
  })
  readonly DEFAULT_CLAIM_MINUTES_COUNT: number;

  @ApiProperty({
    description: 'Minimum number of minutes between branding from referrals',
    example: 480,
  })
  readonly ASGARDIANS_CLAIM_MINUTES_COUNT: number;

  @ApiProperty({
    description: 'Percentage of royalties from 1st level referrals',
    example: 10,
  })
  readonly ASGARDIANS_LEVEL_1_ROYALTY: number;

  @ApiProperty({
    description: 'Percentage of royalties from 2nd level referrals',
    example: 2.5,
  })
  readonly ASGARDIANS_LEVEL_2_ROYALTY: number;

  @ApiProperty({
    description: 'Maximum number of requested users per page',
    example: 100,
  })
  readonly ASGARDIANS_MAX_TAKE: number;

  @ApiProperty({
    description: 'The number of requested users per page by default',
    example: 30,
  })
  readonly ASGARDIANS_DEFAULT_TAKE: number;

  @ApiProperty({
    description: 'Default number of requested jobs per page',
    example: 50,
  })
  readonly TASKS_DEFAULT_TAKE: number;

  @ApiProperty({
    description: 'Maximum number of requested jobs per page',
    example: 100,
  })
  readonly TASKS_MAX_TAKE: number;

  @ApiProperty({
    description: 'The cost of the kick',
    example: 30,
  })
  readonly KICK_COST: number;
}
