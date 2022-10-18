import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../commons/guards';

@ApiTags('ORDER')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    console.log({createOrderDto})
    const {orderDetails, ...order} = createOrderDto
    return this.orderService.create({...order, orderDetails: {
      create: [
        ...(orderDetails as any[])
      ]
    }});
  }

  @Get()
  findAll() {
    return this.orderService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne({id});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const {orderDetails, ...order} = updateOrderDto
    return this.orderService.update({where: {id}, data: {...updateOrderDto, orderDetails: {
      create: [
        ...(orderDetails as any[])
      ]
    }}});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove({id});
  }
}
