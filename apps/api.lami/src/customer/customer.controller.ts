import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { successResponse } from './../commons/functions';
import { JwtAuthGuard } from './../commons/guards';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('CUSTOMER')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const result = await this.customerService.create({...createCustomerDto});
    return successResponse('Registro guardado satisfactoriamente.', result);
  }

  @Get()
  async findAll(@Request() req: Request) {
    const result = await this.customerService.findAll({
      page: req['query'].page, 
      perPage: req['query'].perPage,
      where: {OR: [{identification: {contains: req['query'].search, mode: 'insensitive'}}, {name: {contains: req['query'].search, mode: 'insensitive'}}]}
    });
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.customerService.findOne({id});
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    const result = await this.customerService.update({where: {id}, data: {...updateCustomerDto}});
    return successResponse('Registro actualizado satisfactoriamente.', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.customerService.remove({id});
    return successResponse('', result);
  }
}
