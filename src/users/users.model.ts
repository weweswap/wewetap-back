import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
} from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Task } from '../task/task.model';
import { UserTaskModel } from '../user-task/user-task.model';

interface UserCreationAttrs {
  uuid: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  id: string;

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  uuid: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
  first_name: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
  username: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  asgardians_count: number;

  @Column({ type: DataType.DOUBLE, allowNull: false, defaultValue: 0 })
  coins: number;

  @Column({ type: DataType.DOUBLE, allowNull: false, defaultValue: 0 })
  asgardians_coins: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 10 })
  max_invites_count: number;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
  external_url: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  parent_id: string;

  @BelongsTo(() => User, { foreignKey: 'parent_id' })
  parent: User;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
  wallet_address: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 5 })
  plane_game_pass_count: number;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  last_plane_game_datetime: Date;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  last_default_claim_datetime: Date;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  last_asgardians_claim_datetime: Date;

  @BelongsToMany(() => Task, () => UserTaskModel)
  tasks: Task[];
}
