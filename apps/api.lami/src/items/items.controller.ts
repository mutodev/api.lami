import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { successResponse } from '../commons/functions';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../commons/guards';
import { SearchItemDto } from './dto/search-item.dto';

@ApiTags('ITEMS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    const result = await this.itemsService.create({...createItemDto});
    return successResponse('Registro guardado satisfactoriamente.', result);
  }

  @Get()
  async findAll(@Request() req: Request) {
    
    const result = await this.itemsService.findAll({
      page: req['query'].page, 
      perPage: req['query'].perPage,
      where: {OR: [{code: {contains: req['query'].search || '', mode: 'insensitive'}}, {name: {contains: req['query'].search || '', mode: 'insensitive'}}]},
      wareHouseCode: req['query'].wareHouseCode,
      orderBy: { name: 'asc'}
    });
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.itemsService.findOne({id});
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    const result = await this.itemsService.update({where: {id}, data: {...updateItemDto}});
    return successResponse('Registro actualizado satisfactoriamente.', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.itemsService.remove({id});
    return successResponse('', result);
  }

  @Get('find-all/from-sap')
  async findAllFromSap(@Req() req, @Query() searchItemDto: SearchItemDto) {
    try {
      const result = await this.itemsService.findAllFromSap(searchItemDto.search, searchItemDto.stop);
      return successResponse('', result);
    } catch (error) {
      throw error;
    }
  }

  @Get('find-all/stock-from-sap')
  async findAllStockFromSap(@Req() req, @Query() searchItemDto: SearchItemDto) {
    try {
      const result = await this.itemsService.findAllStockFromSap(searchItemDto.search, searchItemDto.stop);
      return successResponse('', result);
    } catch (error) {
      throw error;
    }
  }  

}
