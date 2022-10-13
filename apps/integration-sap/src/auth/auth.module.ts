import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { CommonsModule } from '../commons/commons.module';

@Module({
  imports: [
    CommonsModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
