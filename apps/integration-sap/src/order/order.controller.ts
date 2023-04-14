import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Ctx, EventPattern, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';
import { from } from 'rxjs';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService,
    private authService: AuthService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @MessagePattern('order/findone')
  async findOne(@Payload() orderCode: string, @Ctx() context: RedisContext) {
    await this.authService.login();
    const result = await this.orderService.findOne(orderCode);
    return result;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, {...updateOrderDto});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @MessagePattern('order/findopenorders')
  async findOpenOrder(@Payload() payload: {startDate: string, endDate: string}, @Ctx() context: RedisContext) {
    await this.authService.login();
    const result = await this.orderService.getOpenOrders(payload.startDate, payload.endDate);
    return result;
  }

  @MessagePattern('order/findordersandcreditnotes')
  async findOrdersAndCreditNotes(@Payload() payload: {startDate: string, endDate: string}, @Ctx() context: RedisContext) {
    await this.authService.login();
    const result = await this.orderService.getOrdersAndCreditNotes(payload.startDate, payload.endDate);
    return result;
  }

}
