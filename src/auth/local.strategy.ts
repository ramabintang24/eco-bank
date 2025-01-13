import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'name', // Menggunakan 'phone' sesuai kebutuhan
      passwordField: 'password',
    });
  }

  async validate(name: string, password: string): Promise<JwtPayload> {
    const user = await this.authService.validateUser(name, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user_id: user.user_id,
      name: user.name,
      phone: user.phone,
      role_id: user.role_id,
    };
  }
}
