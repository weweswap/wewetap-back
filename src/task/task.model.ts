import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { TaskType } from './types';
import { DataTypes } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
import { UserTaskModel } from '../user-task/user-task.model';

interface CreatedTaskAttr {
  name: string;
  type: TaskType;
  external_url: string;
  icon: string | null;
  coins: number;
}

@Table({ tableName: 'tasks' })
export class Task extends Model<Task, CreatedTaskAttr> {
  @ApiProperty({
    example: '9b861bbe-c3a6-4f88-8e5c-b089e32f6932',
    description: 'Unique ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @ApiProperty({ example: 90, description: 'coins needed to complete task' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  coins: number;

  @ApiProperty({ example: 'Launch App', description: 'task name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({
    example: '/images/icon,png',
    description: 'path to icon image',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  icon: string;

  @ApiProperty({ example: TaskType.discord, description: 'type of task' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: TaskType;

  @ApiProperty({
    example: '9b861bbe-c3a6-4f88-8e5c-b089e32f6932',
    description: 'id of parent task',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  parent_id: string;

  @ApiProperty({
    example: 12,
    description: 'min coins needed to complete task',
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  min_coins: number;

  @ApiProperty({
    example: 'https://www.youtube.com/channel/UCbFpanHLe5ZdTE96C_8YC7w',
    description: 'min coins needed to complete task',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  external_url: string;

  @BelongsToMany(() => User, () => UserTaskModel)
  users: User[];
}
