import {
  BelongsTo,
  BelongsToMany,
  BelongsToManyAssociation,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { User } from '../users/users.model';
import { Task } from '../task/task.model';

export enum TaskStatus {
  claim_time = 'claim_time',
  done = 'done',
}

@Table({ tableName: 'user-task' })
export class UserTaskModel extends Model<UserTaskModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(TaskStatus),
    allowNull: false,
    defaultValue: TaskStatus.claim_time,
  })
  status: TaskStatus;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  user_id: string;

  @ForeignKey(() => Task)
  @Column({ allowNull: false })
  task_id: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Task)
  task: User;
}
