// src/auth/dto/auth-user-register.dto.ts
import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Nama lengkap pengguna',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @ApiProperty({
    description: 'Nomor telepon pengguna',
    example: '+6281234567890',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nomor telepon tidak boleh kosong' })
  @Length(10, 20, {
    message: 'Nomor telepon harus terdiri dari 10 hingga 20 karakter',
  })
  phone: string;

  @ApiProperty({
    description: 'Kata sandi untuk akun pengguna',
    example: 'P@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  password: string;

  @ApiProperty({
    description: 'Peran pengguna dalam sistem',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty({ message: 'Peran tidak boleh kosong' })
  role_id: string;
}
