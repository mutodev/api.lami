import { EasyconfigService } from 'nestjs-easyconfig';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from './../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    private _env: EasyconfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('token'), ExtractJwt.fromBodyField('token')]),
      ignoreExpiration: true,
      secretOrKey: _env.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return await this.userService.findOne({id: payload.userId});
  }
}
