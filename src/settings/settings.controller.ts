import { Controller, Get, HttpCode } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/settings.dto';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Получение настроек' })
  @ApiResponse({
    status: 200,
    description: 'Returns the application settings',
    type: SettingsDto,
  })
  @Get()
  @HttpCode(200)
  getSettings(): Promise<SettingsDto> {
    return this.settingsService.getSettings();
  }
}
