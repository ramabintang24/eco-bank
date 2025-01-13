import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { OtpCode } from '../user/entities/otp-code.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
