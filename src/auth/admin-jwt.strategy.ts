import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdminJwtPayload } from './interfaces/admin-jwt-payload.interface';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
  ) {
    const extract_jwt = ExtractJwt.fromExtractors([
      (request) => this.extractJwtFromRequest(request),
    ]);

    super({
      jwtFromRequest: extract_jwt,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ADMIN_ACCESS_SECRET'),
    });
  }

  private extractJwtFromRequest(request: any): string | null {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) return null;

    try {
      return this.helperService.decryptData(token);
    } catch (err) {
      console.error('Token decryption error:', err);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validate(payload: AdminJwtPayload): Promise<AdminJwtPayload> {
    return {
      admin_id: payload.admin_id,
      email: payload.email,
      role: payload.role,
    };
  }
}