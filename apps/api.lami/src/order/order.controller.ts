import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Sse, Req, Query, Res, Inject } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../commons/guards';
import { successResponse } from '../commons/functions';
import { ItemsService } from '../items/items.service';
import { EnumOrderStatus } from '../commons/enums/enum-order-status';
import { Public } from '../commons/decorators';
import { ClientProxy, Ctx, EventPattern, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { seeEventOrderCreatedStream, seeEventOrderStream } from '../commons/streams/actions-order';
import { filter, Observable } from 'rxjs';
import { CustomerService } from '../customer/customer.service';
import { SearchOrderDto } from './dto/search-order.dto';
import { EnumCustomerType } from '../commons/enums/enum-customer-type';

@ApiTags('ORDER')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService,
    private readonly itemsService: ItemsService,
    @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy,
    private readonly customerService: CustomerService) { }

  @Post()
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    try {
      const { orderDetails, ...order } = createOrderDto;
      const customer = await this.customerService.findOne({ id: createOrderDto.customerId });
      const details = await Promise.all(orderDetails.map(async (detail, i) => {
        const item = await this.itemsService.findByCode(detail.itemCode);
        return { ...detail, arTaxCode: item.arTaxCode, project: customer.project || '0022', lineNumber: i };
      }));
      const result = await this.orderService.create({
        ...order, customerId: createOrderDto.customerId, userId: req.user.id, statusId: EnumOrderStatus.PorCobrar, orderDetails: {
          create: [
            ...(details as any[])
          ]
        }
      });
      // this.clientProxi.send('order/create', {id: result.id}).subscribe((result) => {
      //   console.log({result});
      // });
      return successResponse('Registro guardado satisfactoriamente.', result);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Request() req) {
    const user = req.user;
    const search = req['query'].search || '';
    const isNum = !isNaN(search.trim());
    let where: any = {};    
    let condition = [];
    if (isNum) {
      condition.push({ docNumber: +search})
    }
    
    let conditionVendedor = null;
    if (user.role.code == 'VENDEDOR') {
      conditionVendedor = {useId: user.id};
    }
    
    const result = await this.orderService.findAll({
      page: req['query'].page,
      perPage: req['query'].perPage,
      orderBy: { createdAt: 'desc' },
      where: {
        OR: [
          ...condition,
          { customer: { identification: { contains: search, mode: 'insensitive' } } },
          { customer: { firstName: { contains: search, mode: 'insensitive' } } },
          { customer: { lastName: { contains: search, mode: 'insensitive' } } }
        ],
        ...conditionVendedor
      }
    });
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      await this.orderService.updateFromSap({ where: { id } });
    } catch (error) {
      console.log('order/findOne', { error });
    }
    const result = await this.orderService.findOne({ id });
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const { orderDetails, ...order } = updateOrderDto;
    const details = await Promise.all(orderDetails.map(async (detail, i) => {
      const item = await this.itemsService.findByCode(detail.itemCode);
      return { ...detail, arTaxCode: item.arTaxCode, lineNumber: i };
    }));
    const result = await this.orderService.update({
      where: { id }, data: {
        ...order, 
        userId: req.user.id, 
        orderDetails: {
          create: [
            ...(details as any[])
          ]
        }
      }
    });
    // this.clientProxi.send('order/update', {id: result.id}).subscribe((result) => {
    //   console.log({result});
    // });
    return successResponse('Registro actualizado satisfactoriamente.', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.orderService.remove({ id });
    return successResponse('', result);
  }

  @Public()
  @MessagePattern('order/change-status-sap')
  async changeStatusSap(@Payload() orderId: string, @Ctx() context: RedisContext): Promise<any> {
    try {
      const order = await this.orderService.findOne({ id: orderId });
      seeEventOrderStream.next({ data: order });
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

  @Get('get/sales-and-credit-notes')
  async getSalesAndCreditNotes(@Req() req, @Query() searchOrderDto: SearchOrderDto) {
    const result = await this.orderService.getOrdersAndCreditNotes(searchOrderDto.startDate, searchOrderDto.endDate, req.user.salesPersonCode);
    return successResponse('', result);
  }

  @Get('get/open-orders')
  async getOpenOrders(@Req() req, @Query() searchOrderDto: SearchOrderDto) {
    const result = await this.orderService.getOpenOrders(searchOrderDto.startDate, searchOrderDto.endDate, req.user.salesPersonCode);
    return successResponse('', result);
  }

  @Public()
  @MessagePattern('order/get-order-created')
  async getOrderCreated(@Payload() order: any, @Ctx() context: RedisContext): Promise<any> {
    try {
      seeEventOrderCreatedStream.next({ data: order });
      return null;
    } catch (error) {
      throw error;
    }
  }

  @Sse('sse/order-created')
  seeEventOrderCreated(@Req() req, @Query('token') token: string): Observable<MessageEvent> {
    try {
      return seeEventOrderCreatedStream.pipe(filter((data) => data.data.userId === req.user.id));
    } catch (error) {
      console.log({ error });
    }
  }


  // @Public()
  @Get('generate/pdf/:id')
  async generatePdf(@Param('id') id, @Res() res) {
    const buffer = await this.orderService.generatePdf({ id });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=order.pdf`,
      'Content-Length': buffer.length,
      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });
    res.end(buffer);
  }

  @Get('get-customer/by-order/:id')
  async findCustomerByOrder(@Req() req, @Param('id') id) {
    const customer = await this.orderService.findCustomerByOrder({id});
    return successResponse('', customer);
  }

  @Get('get-order-detail/by-order/:id')
  async findDetailByOrder(@Req() req, @Param('id') id) {
    const result = await this.orderService.findDetailByOrder({id});
    return successResponse('', result);
  }

}
