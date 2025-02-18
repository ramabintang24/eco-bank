// src/auth/dto/auth-user-register.dto.ts
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Nama Lengkap',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @ApiProperty({
    description: 'Email',
    example: 'johndoe@gmail.com',
  })
  @IsEmail({}, { message: 'Email Tidak Valid' })
  @IsNotEmpty({ message: 'Email Tidak Boleh Kosong' })
  email: string;

  @ApiProperty({
    description: 'Kata Sandi',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kata sandi Tidak Boleh Kosong' })
  @MinLength(8, {
    message: 'Password Harus Memiliki Panjang Minimal 8 Karakter',
  })
  password: string;
}
