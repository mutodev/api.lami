import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Sse, Req, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../commons/guards';
import { successResponse } from '../commons/functions';
import { ItemsService } from '../items/items.service';
import { EnumOrderStatus } from '../commons/enums/enum-order-status';
import { Public } from '../commons/decorators';
import { Ctx, EventPattern, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { seeEventOrderStream } from '../commons/streams/actions-order';
import { filter, Observable } from 'rxjs';
import { CustomerService } from '../customer/customer.service';

@ApiTags('ORDER')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService,
              private readonly itemsService: ItemsService,
              private readonly customerService: CustomerService) {}

  @Post()
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const {orderDetails, ...order} = createOrderDto;
    const customer = await this.customerService.findOne({id: createOrderDto.customerId});
    const details = await Promise.all(orderDetails.map(async (detail) => {
      const item = await this.itemsService.findByCode(detail.itemCode);     
      return {...detail, arTaxCode: item.arTaxCode, project: customer.project || '0022'};
    }));
    const result = await this.orderService.create({...order, userId: req.user.id, statusId: EnumOrderStatus.PorCobrar, orderDetails: {
      create: [
        ...(details as any[])
      ]
    }});
    return successResponse('Registro guardado satisfactoriamente.', result);
  }

  @Get()
  async findAll(@Request() req: Request) {
    const result = await this.orderService.findAll({page: req['query'].page, perPage: req['query'].perPage, orderBy: {createdAt: 'desc'}});
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.orderService.findOne({id});
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const {orderDetails, ...order} = updateOrderDto;
    const details = await Promise.all(orderDetails.map(async (detail) => {
      const item = await this.itemsService.findByCode(detail.itemCode);
      return {...detail, arTaxCode: item.arTaxCode}
    }));
    const result = await this.orderService.update({where: {id}, data: {...order, userId: req.user.id, orderDetails: {
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

  @Public()
  @EventPattern('order/change-status-sap')
  async changeStatusSap(@Payload() orderId: string, @Ctx() context: RedisContext): Promise<any> {
    try {
      const order = await this.orderService.findOne({id: orderId});
      seeEventOrderStream.next({data: order});
    return null;
    } catch (error) {
      throw error;
    }
  }

  @Sse('sse/change-status-sap')
	seeEventChangeStatus(@Req() req, @Query('token') token: string): Observable<MessageEvent> {
		try {
			return seeEventOrderStream.pipe(filter((data) => data.data.userId === req.user.id));
		} catch (error) {
			console.log({ error });
		}
	}

}
