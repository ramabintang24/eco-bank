import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly helperService: HelperService,
  ) {
    const extract_jwt = ExtractJwt.fromExtractors([
      (request) => this.extractJwtFromRequest(request),
    ]);

    super({
      jwtFromRequest: extract_jwt,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_USER_ACCESS_SECRET'),
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

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return {
      user_id: payload.user_id,
      email: payload.email,
      role: payload.role,
    };
  }
}
