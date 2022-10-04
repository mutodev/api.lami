import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EasyconfigModule, EasyconfigService } from 'nestjs-easyconfig';
import { CommonsModule } from 'src/commons/commons.module';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    UserModule,
    CommonsModule,
    PassportModule,
    EasyconfigModule.register({ path: './.env' }),
    JwtModule.registerAsync({
      imports: [EasyconfigModule.register({ path: './.env' })],
      useFactory: async (_env: EasyconfigService) => ({
        secret: _env.get('JWT_SECRET'),
        signOptions: {
          expiresIn: _env.get('EXPIRES_IN'),
          audience: _env.get('APP_URL'),
        },
      }),
      inject: [EasyconfigService],
    }),
  ],


  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {
  constructor(_env: EasyconfigService) {
    console.log('EXPIRES_IN', _env.get('EXPIRES_IN'))
  }
}
