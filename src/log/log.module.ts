import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuccessLog } from './entities/success-log.entity';
import { ErrorLog } from './entities/error-log.entity';
import { LogService } from './log.service';

@Module({
  imports: [TypeOrmModule.forFeature([SuccessLog, ErrorLog])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
