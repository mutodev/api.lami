import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  test() {
    return this.authService.login();
  }

  @MessagePattern('auth/login')
  async findById(@Ctx() context: RedisContext) {
    return await this.authService.login();
  }
  
}
