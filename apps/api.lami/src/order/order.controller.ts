import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Sse, Req, Query, Res } from '@nestjs/common';
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
              private readonly customerService: CustomerService) {}

  @Post()
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const {orderDetails, ...order} = createOrderDto;
    /*let customer = await this.customerService.findOne({id: customerId});
    if (!customer) {
      try {
        const cus = await this.customerService.findFromSap(customerId);
        const names = cus.CarName.split(' ');
        const firstName = names[0];
        const lastName = names[1] || '';
        const lastName2 = names[2] || '';
        const address1 = cus.BPAddresses[0];
        const address2 = cus.BPAddresses[1];
        customer = await this.customerService.createFromOrder({
          typeId: EnumCustomerType.PersonaNatural,
          name: cus.CarName,   
          identification: cus.CarCode,    
          email: cus.EmailAddress,
          firstName: firstName,
          lastName: lastName,
          lastName2: lastName2,
          source: cus.CardType == 'cCustomer' ? 'C' : 'L',
          address: '',
          address2: '',
          phone: cus.Phone1,
          phone2: cus.Phone2,
          U_HBT_RegTrib: cus.U_HBT_RegTrib,
          groupCode: cus.GroupCode,
          payTermsGrpCode: cus.PayTermsGrpCode,   
          salesPersonCode: cus.SalesPersonCode,     
          U_HBT_Nacional: cus.U_HBT_Nacional,
          U_HBT_RegFis: cus.U_HBT_RegFis,
          U_HBT_MedPag: cus.U_HBT_MedPag,
          firstNameBilling: cus.U_HBT_Nombres,
          lastNameBilling: cus.U_HBT_Apellido1,
          lastName2Billing: cus.U_HBT_Apellido2,
          project: '0011',
          checkSameInfo: false,
          City: address1?.City,
          County: address1?.County,
          addressBilling: address1?.Street,
          CityBilling: address2?.address2,
          CountyBilling: address2?.County,
          checkSameAddress: false,
          U_HBT_ActEco: cus?.U_HBT_ActEco,
          neighborhoodName: '',
          neighborhoodNameBilling: '',
          userId: req.user.id,
          sendToSap: true
        } as any);
      } catch (error) {
        console.log({error});
      }      
    }
    createOrderDto.customerId = customer.id;*/
    const customer = await this.customerService.findOne({id: createOrderDto.customerId});
    const details = await Promise.all(orderDetails.map(async (detail) => {
      const item = await this.itemsService.findByCode(detail.itemCode);     
      return {...detail, arTaxCode: item.arTaxCode, project: customer.project || '0022'};
    }));
    const result = await this.orderService.create({...order, customerId: createOrderDto.customerId, userId: req.user.id, statusId: EnumOrderStatus.PorCobrar, orderDetails: {
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
    try {
      await this.orderService.updateFromSap({where: {id}});
    } catch (error) {
      console.log('order/findOne', {error});
    }    
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
  @EventPattern('order/get-order-created')
  async getOrderCreated(@Payload() order: any, @Ctx() context: RedisContext): Promise<any> {
    try {
      seeEventOrderCreatedStream.next({data: order});
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
    const buffer = await this.orderService.generatePdf({id});
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

}
