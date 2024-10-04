import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { EventType } from './types/eventType';
import { DataTypes } from 'sequelize';
import { CreateLogDto } from './dto/create-log.dto';

@Table({ tableName: 'logs', updatedAt: false })
export class Log extends Model<Log, CreateLogDto> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: true,
  })
  user_id: string;

  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: true,
  })
  task_id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  is_violation: boolean;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  event_type: EventType;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  coins: number;
}
