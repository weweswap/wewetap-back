import {Table, Column, Model, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {DataTypes, Sequelize} from "sequelize";
import {User} from "../users/users.model";


@Table({tableName: 'referals',createdAt:false,updatedAt:false})
export class Referals extends Model <Referals> {

    @Column({type: DataType.UUID, primaryKey: true, unique: true, defaultValue: DataTypes.UUIDV4})
    id: string;

    @BelongsTo(() => User )
    @Column({type: DataType.STRING, unique: true, allowNull: false,})
    uuid: number

    @BelongsTo(() => User )
    @Column({type: DataType.UUID, allowNull: true,})
    parentId: string;

}