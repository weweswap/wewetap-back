import { ApiProperty } from '@nestjs/swagger';

export class RemoveTaskDto {
  @ApiProperty({ type: 'string', required: true })
  task_id: string;
}
