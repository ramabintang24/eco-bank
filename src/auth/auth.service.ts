import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { HelperService } from 'src/helper/helper.service';
// import { LoginDto } from './dto/auth-login.dto';
import { RegisterDto } from './dto/auth-register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private helperService: HelperService,
    private jwtService: JwtService,
  ) {}

  // ===> REGISTER <===
  async userRegister(registerDto: RegisterDto): Promise<{ user: Auth; token: string }> {
    const { name, phone, password, role_id } = registerDto;

    // Periksa apakah user sudah terdaftar
    const existingUser = await this.authRepository.findOne({ where: { name } }); // Use phone instead of name for uniqueness
    if (existingUser) {
      throw new BadRequestException('Pegawai sudah terdaftar');
    }

    // Hash password
    const passwordHash = await this.helperService.hashPassword(name, phone, password);

    // Buat user baru
    const newUser = this.authRepository.create({ name, phone, password: passwordHash, role_id });
    await this.authRepository.save(newUser);

    // Generate JWT payload
    const payload: JwtPayload = {
      user_id: newUser.user_id,
      name: newUser.name,
      phone: newUser.phone,
      role_id: newUser.role_id,
    };

    return await this.userLogin ( payload );
  }

  // ===> LOGIN <===
  async userLogin(payload: JwtPayload) {
    
    // Cari user berdasarkan data payload
    const user = await this.authRepository.findOne({ where: { name: payload.name } });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Generate JWT token baru (misalnya jika Anda ingin memperbarui token)
    const token = this.jwtService.sign({
      user_id: user.user_id,
      name: user.name,
      phone: user.phone,
      role_id: user.role_id,
    });


    return { token, user };
  }

  // ===> VALIDATE USER <===
  async validateUser(name: string, password: string): Promise<Auth | null> {
    const user = await this.authRepository.findOne({ where: { name } });
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.helperService.verifyPassword(
      this.helperService.passwordSalting(user.name, user.phone, password),
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Kata sandi salah');
    }

    return user;
  }
}
