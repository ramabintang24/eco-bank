  import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { User } from 'src/user/entities/user.entity';
  import { Wallet } from 'src/transaction/entities/wallet.entity';
  import { JwtService } from '@nestjs/jwt';
  import { HelperService } from 'src/helper/helper.service';
  // import { LoginDto } from './dto/auth-login.dto';
  import { RegisterDto } from '../dto/auth-register.dto';
  import { JwtPayload } from '../interfaces/jwt-payload.interface';
  import { AdminJwtPayload } from '../interfaces/admin-jwt-payload.interface';
  import { ConfigService } from '@nestjs/config';
  import { LoginDto } from '../dto/auth-login.dto';

  @Injectable()
  export class UserService {
    constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      @InjectRepository(Wallet)
      private walletRepository: Repository<Wallet>,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
      private readonly helperService: HelperService, 
    ) {}

    // ===> REGISTER <===
    async userRegister(registerDto: RegisterDto) {

      // Check if the email is already in use
      const existingUser = await this.userRepository.findOne ({ where: { email: registerDto.email } });
      
      if (existingUser) {
        throw new BadRequestException('Email sudah terdaftar');
      }

      // Hash the Password
      const passwordHash = await this.helperService.hashPassword(
        registerDto.email,
        registerDto.password,
      );

      // Create a new user
      const newUser = await this.userRepository.create({
        email: registerDto.email,
        name: registerDto.name,
        password: passwordHash,
        role: 'User',
        profile_url: this.configService.get<string>('DEFAULT_PROFILE_URL'),
      });

      await this.userRepository.save(newUser);

      // // Generate JWT payload
      // const payload: JwtPayload = {
      //   user_id: newUser.user_id,
      //   email: newUser.email,
      //   role: newUser.role,
      // };

      return await this.userLogin({
      email: registerDto.email,
      password: registerDto.password,
      });
    }

    // ===> LOGIN USER / ADMIN <===
    async userLogin(loginDto: LoginDto) {
      const user = await this.userRepository.findOne({ 
        where: { email: loginDto.email } 
      });

      if (!user) {
        throw new NotFoundException('User tidak ditemukan');
      }

      // Validasi password
      const saltedPassword = this.helperService.passwordSalting(
        loginDto.email,
        loginDto.password,
      );

      console.log("salted", saltedPassword);
      
      const isPasswordValid = await this.helperService.verifyPassword(
        saltedPassword,
        user.password,
      );

      console.log("valid", isPasswordValid);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Jika role admin, berikan token khusus admin
      if (user.role === 'Admin') {
        return this.generateAdminToken(user);
      }

      // Pastikan wallet user ada
      await this.ensureWalletExists(user.user_id);

      // Update last login timestamp
      await this.userRepository.update(user.user_id, {
        last_login_at: new Date(),
      });

      // Buat token user
      return this.generateUserToken(user);
    }

    private async ensureWalletExists(user_id: string) {
      let wallet = await this.walletRepository.findOne({ where: { user_id: user_id } });
      if (!wallet) {
        wallet = this.walletRepository.create({ user_id: user_id });
        await this.walletRepository.save(wallet);
      }
    }

    private generateUserToken(user: User) {
      const payload: JwtPayload = {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      };
      let access_token = this.jwtService.sign(payload);
      access_token = this.helperService.encryptData(access_token);
      return { access_token, user };
    }

    private generateAdminToken(user: User) {
      const payload: AdminJwtPayload = {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      };
      let access_token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ADMIN_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ADMIN_ACCESS_DURATION'),
      });
      access_token = this.helperService.encryptData(access_token);
      return { access_token, user };
    }


    // ===> VALIDATE USER <===
    async validateUser(email: string, password: string): Promise<User | null> {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        return null;
      }

      // Generate a salted password hash using the user's email and password
      const saltedPassword = this.helperService.passwordSalting(email, password);

      // Verify the salted password against the stored hash
      const isPasswordValid = await this.helperService.verifyPassword(
        saltedPassword,
        user.password,
      );

      // If the password is invalid, throw an unauthorized exception
      if (!isPasswordValid) {
        throw new UnauthorizedException('Kata Sandi Salah');
      }

      // Return the user object if authentication is successful
      return user;
    }
  }
