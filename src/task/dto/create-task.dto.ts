import { TaskType } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Grassroots Crypto - Tutorials, Guides, Explanations',
    description: 'name of task',
    type: 'string',
  })
  readonly name: string;

  @ApiProperty({
    example: 'Grassroots Crypto - Tutorials, Guides, Explanations',
    description: 'type of task',
    type: 'enum',
    enum: TaskType,
  })
  readonly type: TaskType;

  @ApiProperty({
    example: 'http://youtube.com/c/THORSwapCommunity?sub_confirmation=1',
    description: 'link to task',
    type: 'string',
  })
  readonly external_url: string;

  @ApiProperty({
    example: '/img/path.img',
    description: 'path to icon',
    type: 'string',
  })
  readonly icon: string;

  @ApiProperty({ example: 90, description: 'path to icon', type: 'number' })
  readonly coins: number;
}
