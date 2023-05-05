import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../commons/guards';
import { successResponse } from '../commons/functions';

@ApiTags('STORES')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('store')
export class StoreController {
  
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Request() req: Request, @Body() createStoreDto: CreateStoreDto) {
    const result = await this.storeService.create(createStoreDto);
    return successResponse('', result);
  }

  @Get()
  async findAll(@Request() req: Request) {
    const result = await this.storeService.findAll({
      page: req['query'].page, 
      perPage: req['query'].perPage,
      where: {name: {contains: req['query'].search || '', mode: 'insensitive'}}});
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Request() req: Request, @Param('id') id: string) {
    const result = await this.storeService.findOne({id});
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Request() req: Request, @Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    console.log({updateStoreDto});
    const result = this.storeService.update({where: {id}, data: {...updateStoreDto}});
    return successResponse('Registro actualizado satisfactoriamente.', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.storeService.remove({id});
    return successResponse('Registro eliminado satisfactoriamente.', result);
  }
}
