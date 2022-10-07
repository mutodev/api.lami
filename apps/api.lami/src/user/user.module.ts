import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { CommonsModule } from './../commons/commons.module';

@Module({
  imports: [
    CommonsModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
