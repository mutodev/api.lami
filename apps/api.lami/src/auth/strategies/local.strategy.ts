import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { AuthService } from './../../auth/auth.service';
import { IResponse } from './../../commons/interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<any> {

    console.log({ username });

    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    let user = await authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException({
      status: 'error',
      message: 'Credenciales invalidas.',
      data: null
    } as IResponse<any>);

    user = await authService.validateUserInactive(username, password);

    if (!user) throw new HttpException(
      {
        status: 'error',
        message: 'El usuario esta inactivo.',
        data: null
      },
      403
    )

    return user;
    
  }
  
}
