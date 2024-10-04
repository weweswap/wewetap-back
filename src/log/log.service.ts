import { Injectable } from '@nestjs/common';
import { Log } from './log.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log) private logRepository: typeof Log) {}

  async createLog(dto: CreateLogDto) {
    return await this.logRepository.create(dto);
  }
}
