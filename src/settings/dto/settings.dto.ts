import { ApiProperty } from '@nestjs/swagger';

export class SettingsDto {
  @ApiProperty({
    description:
      'Максимальное количество инвайтов, доступное обычному пользователю, 10',
    example: 10,
  })
  readonly MAX_INVITES_COUNT: number;

  @ApiProperty({
    description: 'Количество монет, которые могут клеймиться,',
    example: 52.7,
  })
  readonly DEFAULT_CLAIM_COINS_COUNT: number;

  @ApiProperty({
    description: 'Минимальное количество минут между клеймами',
    example: 480,
  })
  readonly DEFAULT_CLAIM_MINUTES_COUNT: number;

  @ApiProperty({
    description: 'Минимальное количество минут между клеймами от рефералов',
    example: 480,
  })
  readonly ASGARDIANS_CLAIM_MINUTES_COUNT: number;

  @ApiProperty({
    description: 'Процент роялти от рефералов 1го уровня',
    example: 10,
  })
  readonly ASGARDIANS_LEVEL_1_ROYALTY: number;

  @ApiProperty({
    description: 'Процент роялти от рефералов 2го уровн',
    example: 2.5,
  })
  readonly ASGARDIANS_LEVEL_2_ROYALTY: number;

  @ApiProperty({
    description:
      'Максимальное количество запрашиваемых пользователей на страницу,',
    example: 100,
  })
  readonly ASGARDIANS_MAX_TAKE: number;

  @ApiProperty({
    description:
      'Количество запрашиваемых пользователей на страницу по умолчанию',
    example: 30,
  })
  readonly ASGARDIANS_DEFAULT_TAKE: number;

  @ApiProperty({
    description: 'Количество запрашиваемых заданий на страницу по умолчанию',
    example: 50,
  })
  readonly TASKS_DEFAULT_TAKE: number;

  @ApiProperty({
    description: 'Максимальное количество запрашиваемых заданий на страниц',
    example: 100,
  })
  readonly TASKS_MAX_TAKE: number;

  @ApiProperty({
    description: 'Стоимость кика',
    example: 30,
  })
  readonly KICK_COST: number;
}
