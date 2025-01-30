import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './auth/user/user.module';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { BasicDataFormatInterceptor } from './data-format.interceptor';
import { LogInterceptor } from './log/log.interceptor';
import { AllExceptionFilter } from './log/all-exception-filter';
import { LogModule } from './log/log.module';
import { UsersController } from './user/user.controller';
import { UsersService } from './user/user.service';
import { UsersModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PassportModule,
    UserModule,
    LogModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: BasicDataFormatInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
