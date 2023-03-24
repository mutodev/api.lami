import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../commons/guards';
import { successResponse } from './../commons/functions';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('USER')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create({...createUserDto });
    return successResponse('Registro guardado satisfactoriamente.', result);
  }

  @Get()
  async findAll(@Request() req: Request) {
    const result = await this.userService.findAll({page: req['query'].page, perPage: req['query'].perPage});
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.userService.findOne({id});
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const {password, ...user} = updateUserDto;
    const result = await this.userService.update({ where: {id}, data: {...user}});
    return successResponse('', result);
  }

  @Patch(':id/update-password')
  async updatePassword(@Param('id') id: string, @Body() updateUserDto: UpdatePasswordDto) {
    const {password} = updateUserDto;
    const result = await this.userService.updatePassword(id, password);
    return successResponse('La contraseña ha sido cambiada con éxito.', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove({id});
    return successResponse('Registro eliminado satisfactoriamente.', result);
  }
}
