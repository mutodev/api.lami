import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { successResponse } from 'src/commons/functions';
import { LocalAuthGuard } from 'src/commons/guards';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO) {
    const result = await this.authService.login(body.username);
    return successResponse('', result);
  }
  
}
