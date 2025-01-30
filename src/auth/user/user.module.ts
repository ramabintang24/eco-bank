import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { HelperModule } from 'src/helper/helper.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../local.strategy';
import { JwtStrategy } from '../jwt.strategy';
import { Wallet } from 'src/transaction/entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet]),
    HelperModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Pastikan ConfigModule diimpor di sini jika dibutuhkan
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // signOptions: {
        //   expiresIn: configService.get<string>('JWT_USER_ACCESS_DURATION'),
        // },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
