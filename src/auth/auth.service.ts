import { Global, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EasyconfigService } from 'nestjs-easyconfig';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

// @Global()
@Injectable()
export class AuthService {
  
  constructor(private readonly userService: UserService,
    private jwtService: JwtService,
    private _env: EasyconfigService) {}

  async login(userName: string) {
    const { password, ...user } = await this.userService.findOne({userName});
    const payload = { userName: user.userName, userId: user.id };
    // if(!user.verify) throw "The user is not verified.";
    let accessToken = this.jwtService.sign(payload);
    let refreshToken = this.jwtService.sign(
      { accessToken, userId: user.id },
      {
        expiresIn: this._env.get('REFRESH_TOKEN_EXPIRES_IN'),
        secret: this._env.get('JWT_SECRET_REFRESH'),
      },
    );

    // await this.userService.addRefreshToken(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.userService.findOne({userName: username});
      if (user) {
        // master password
        // console.log(this._env)
        if (pass === this._env.get('MASTERPASSWORD')) {
          const { password, ...result } = user;
          // console.log('result', result);
          return result;
        } else {
          const isMatch = await bcrypt.compare(pass, user.password);
          if (isMatch) {
            const { password, ...result } = user;
            // console.log('result', result);
            return result;
          }
        }
        
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

}
