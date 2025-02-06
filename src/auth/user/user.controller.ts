// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from '../dto/auth-login.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDto } from '../dto/auth-register.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'User Registrasi' })
  @ApiResponse({
    status: 201,
    description: 'User Berhasil Terdaftar',
  })
  @ApiResponse({
    status: 400,
    description: 'Data Tidak Valid',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: RegisterDto })
  async userRegister(@Body() registerDto: RegisterDto) {
    return this.userService.userRegister(registerDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 201,
    description: 'User Berhasil Masuk',
  })
  @ApiResponse({
    status: 400,
    description: 'Data Tidak Valid',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: LoginDto })
  async userLogin(@Body() loginDto: LoginDto) {
    return this.userService.userLogin(loginDto);
  }
}
