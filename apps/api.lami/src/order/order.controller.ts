import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../commons/guards';
import { successResponse } from '../commons/functions';
import { ItemsService } from '../items/items.service';

@ApiTags('ORDER')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService,
              private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    console.log({createOrderDto})
    const {orderDetails, ...order} = createOrderDto;
    const details = await Promise.all(orderDetails.map(async (detail) => {
      const item = await this.itemsService.findByCode(detail.itemCode);
      return {...detail, arTaxCode: item.arTaxCode}
    }));
    const result = await this.orderService.create({...order, orderDetails: {
      create: [
        ...(details as any[])
      ]
    }});
    return successResponse('Registro guardado satisfactoriamente.', result);
  }

  @Get()
  async findAll(@Request() req: Request) {
    const result = await this.orderService.findAll({page: req['query'].page, perPage: req['query'].perPage});
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.orderService.findOne({id});
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const {orderDetails, ...order} = updateOrderDto;
    const details = await Promise.all(orderDetails.map(async (detail) => {
      const item = await this.itemsService.findByCode(detail.itemCode);
      return {...detail, arTaxCode: item.arTaxCode}
    }));
    const result = await this.orderService.update({where: {id}, data: {...order, orderDetails: {
      create: [
        ...(details as any[])
      ]
    }}});
    return successResponse('Registro actualizado satisfactoriamente.', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.orderService.remove({id});
    return successResponse('', result);
  }

}
