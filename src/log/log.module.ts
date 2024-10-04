import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from './log.model';

@Module({
  providers: [LogService],
  imports: [SequelizeModule.forFeature([Log])],
  exports: [LogService],
})
export class LogModule {}
