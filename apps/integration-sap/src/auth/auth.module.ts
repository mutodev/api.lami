import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { EasyconfigModule } from 'nestjs-easyconfig';
import * as https from 'https';

@Module({
  imports: [
    EasyconfigModule.register({ path: './.env' }),
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
