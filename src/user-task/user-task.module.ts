import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Task} from "../task/task.model";
import {UserTaskModel} from "./user-task.model";


@Module({
    imports: [
        SequelizeModule.forFeature([UserTaskModel])
    ],
})
export class UserTaskModule {}
