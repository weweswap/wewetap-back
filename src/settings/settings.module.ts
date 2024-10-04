import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { TaskService } from '../task/task.service';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
