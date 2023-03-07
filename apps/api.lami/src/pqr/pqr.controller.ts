import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PqrService } from './pqr.service';
import { CreatePqrDto } from './dto/create-pqr.dto';
import { UpdatePqrDto } from './dto/update-pqr.dto';
import { JwtAuthGuard } from '../commons/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { successResponse } from '../commons/functions';

@ApiTags('PQR')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pqr')
export class PqrController {
  constructor(private readonly pqrService: PqrService) {}

  @Post()
  async create(@Request() req: Request, @Body() createPqrDto: CreatePqrDto) {
    const result = await this.pqrService.create({...createPqrDto});
    return successResponse('Registro guardado satisfactoriamente.', result);
  }

  @Get()
  async findAll(@Request() req: Request) {
    const result = await this.pqrService.findAll({
      page: req['query'].page, 
      perPage: req['query'].perPage,
      where: {OR: [{name: {contains: req['query'].search || '', mode: 'insensitive'}}, {title: {contains: req['query'].search || '', mode: 'insensitive'}}]},
      wareHouseCode: req['query'].wareHouseCode
    });
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.pqrService.findOne({id});
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePqrDto: UpdatePqrDto) {
    const result = await this.pqrService.update({where: {id}, data: {...updateItemDto}});
    return successResponse('Registro actualizado satisfactoriamente.', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.pqrService.remove({id});
    return successResponse('', result);
  }
}
