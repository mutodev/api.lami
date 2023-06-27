import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PricesService } from './prices.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../commons/guards';
import { successResponse } from '../commons/functions';

@ApiTags('PRICES')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('prices')
export class PricesController {

  constructor(private readonly pricesService: PricesService) {}

  @Post()
  async create(@Body() createPriceDto: CreatePriceDto) {
     const result = await this.pricesService.create(createPriceDto);
     return successResponse('Registro guardado satisfactoriamente.', result);
  }

  @Get()
  async findAll(@Request() req: Request) {
    const result = await this.pricesService.findAll({
      page: req['query'].page, 
      perPage: req['query'].perPage,
      where: {OR: [
        {code: {contains: req['query'].search || '', mode: 'insensitive'}},
        {name: {contains: req['query'].search || '', mode: 'insensitive'}}
      ]}});
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.pricesService.findOne({id});
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
    const result = await this.pricesService.update({where : {id}, data: {...updatePriceDto}});
    return successResponse('Registro actualizado satisfactoriamente.', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.pricesService.remove({id});
    return successResponse('', result);
  }
  
}
