import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionsService } from 'src/https/permissions/permissions.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configServer: ConfigService,
    // private permissionsService: PermissionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServer.get<string>('JWT_ACCESS_TOKEN'),
    });
  }

  async validate(payload: any) {
    // const user = await this.permissionsService.findOne(payload.sub);
    return payload;
  }
}
