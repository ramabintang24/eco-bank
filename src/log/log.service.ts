// log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuccessLog } from './entities/success-log.entity';
import { ErrorLog } from './entities/error-log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(SuccessLog)
    private readonly successLogRepository: Repository<SuccessLog>,

    @InjectRepository(ErrorLog)
    private readonly errorLogRepository: Repository<ErrorLog>,
  ) {}

  // ===== C R E A T E   S U C C E S S   L O G =====
  async createSuccessLog(logEntry: Partial<SuccessLog>): Promise<SuccessLog> {
    const newLog = this.successLogRepository.create(logEntry);
    return this.successLogRepository.save(newLog);
  }

  // ===== C R E A T E   E R R O R   L O G =====
  async createErrorLog(logEntry: Partial<ErrorLog>): Promise<ErrorLog> {
    const newLog = this.errorLogRepository.create(logEntry);
    return this.errorLogRepository.save(newLog);
  }
}
