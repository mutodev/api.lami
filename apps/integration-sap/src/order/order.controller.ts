import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy, Ctx, EventPattern, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom, from } from 'rxjs';
import { PrismaService } from '../commons/prisma.service';
import { EnumCustomerType } from '../commons/enum-customer-type';
import { ProductService } from '../product/product.service';
import { CustomerService } from '../customer/customer.service';
import { OrderGateway } from './order.gateway';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService,
    private prismaService: PrismaService,
    private productService: ProductService,
    private customerService: CustomerService,
    @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy,
    private readonly orderGateway: OrderGateway,
    private authService: AuthService) { }

  @MessagePattern('order/create')
  async create(@Payload() payload: { id: string }, @Ctx() context: RedisContext) {
    try {
      const order = await this.prismaService.order.findUnique({ where: { id: payload.id }, include: { customer: true, orderDetails: true } });
      const setting = await this.prismaService.setting.findFirst({ where: { name: 'Project' }, include: { settingDetail: true } });
      const paymentTerm = await this.prismaService.setting.findUnique({ where: { name: 'PayTermsGrpCode' }, include: { settingDetail: { where: { active: true, code: order.customer.payTermsGrpCode } } } });
      await this.authService.login();
      const codes = (paymentTerm.settingDetail[0].extendedData as any).codes;
      const arrayIdentification = order.customer.identification.split('-');
      let carcode = order.customer.typeId == EnumCustomerType.PersonaJuridica.toString() && arrayIdentification[1] && arrayIdentification[2] ? `${arrayIdentification[0]}-${arrayIdentification[1]}` : order.customer.identification;
      try {
        let customerSap = await this.customerService.findOne(carcode);
        if (customerSap.status === 200) {
          carcode = customerSap.data.CardCode;
        } else {
          let customerSap = await this.customerService.findOne(order.customer.identification);
          carcode = customerSap.data.CardCode;
        }
      } catch (error) {
        console.log('createOrder', { error });
      }

      let payloadOrder = {
        CardCode: carcode,
        Series: +order.serie,
        DocDate: order.date.toISOString().replace('T', ' ').substring(0, 10),
        DocDueDate: order.dueDate.toISOString().replace('T', ' ').substring(0, 10),
        SalesPersonCode: order.salesPersonCode || '',
        Comments: `${order.comments}\n\n${order.orderDetails.map((d) => `${d.aditionalInfo}\n\n`)}`,
        DiscountPercent: order.discount || 0,
        VatSum: order.vatTotal || 0,
        DocTotal: order.total || 0,
        DocumentLines: order.orderDetails.map((item) => {
          const project = setting.settingDetail.find((d) => d.code == item.project);
          return {
            ItemCode: item.itemCode,
            Quantity: item.amount,
            UnitPrice: item.value,
            DiscountPercent: item.discount || 0,
            // Price: item.value * item.amount,
            WarehouseCode: item.wareHouseCode || null,
            ProjectCode: project.value,
            ArTaxCode: item.arTaxCode,
            CostingCode: codes?.factorCode,
            CostingCode2: codes?.factorCode2,
            COGSCostingCode3: 'VTA',
            COGSCostingCode2: codes?.factorCode2
          };
        })
      }

      const result = await this.orderService.create(payloadOrder);

      if (result.status === 201) {
        order.sendToSap = true;
        const orderUpdate = await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: true, docNumber: result.data.DocNum, integrationId: result.data.DocEntry } });

        order.orderDetails.map(async (detail) => {
          try {
            const item = await this.productService.findOne(detail.itemCode, 'QuantityOnStock,QuantityOrderedFromVendors,QuantityOrderedByCustomers');
            await this.prismaService.items.updateMany({
              where: { code: detail.itemCode }, data: {
                quantityOnStock: item.data.QuantityOnStock,
                quantityOrderedFromVendors: item.data.QuantityOrderedFromVendors,
                quantityOrderedByCustomers: item.data.QuantityOrderedByCustomers
              }
            });
          } catch (error) {
            console.log('update item', error);
          }
        });

        this.clientProxi.send('order/change-status-sap', {orderId: order.id}).subscribe();
        this.clientProxi.send('order/get-order-created', {order: orderUpdate}).subscribe();
      } else {
        await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: false, messageError: result.message } });
      }

      return result.data;

    } catch (error) {
      console.log('order/create', {error});
    }

  }

  @Get()
  async findAll() {
    const order = await this.prismaService.order.findUnique({where: {id: "8d8c0997-0f96-4e4d-95b8-23294ae25708"}})
    const r = await this.clientProxi.send('order/get-order-created', { order });
    return await firstValueFrom(r);
    //return this.orderService.findAll();
  }

  @MessagePattern('order/findone')
  async findOne(@Payload() payload: { orderCode: string}, @Ctx() context: RedisContext) {
    await this.authService.login();
    const result = await this.orderService.findOne(payload.orderCode);
    return result.data;
  }

  @MessagePattern('order/update')
  async update(@Payload() payload: { id: string }, @Ctx() context: RedisContext) {
    try {
      const order = await this.prismaService.order.findUnique({ where: { id: payload.id }, include: { customer: true, orderDetails: true } });
      const setting = await this.prismaService.setting.findFirst({ where: { name: 'Project' }, include: { settingDetail: true } });
      const paymentTerm = await this.prismaService.setting.findUnique({ where: { name: 'PayTermsGrpCode' }, include: { settingDetail: { where: { active: true, code: order.customer.payTermsGrpCode } } } });
      await this.authService.login();
      const codes = (paymentTerm.settingDetail[0].extendedData as any).codes;
      const arrayIdentification = order.customer.identification.split('-');
      let carcode = order.customer.typeId == EnumCustomerType.PersonaJuridica.toString() && arrayIdentification[1] && arrayIdentification[2] ? `${arrayIdentification[0]}-${arrayIdentification[1]}` : order.customer.identification;
      try {
        let customerSap = await this.customerService.findOne(carcode);
        if (customerSap.status === 200) {
          carcode = customerSap.data.CardCode;
        } else {
          let customerSap = await this.customerService.findOne(order.customer.identification);
          carcode = customerSap.data.CardCode;
        }
      } catch (error) {
        console.log('createOrder', { error });
      }

      let payloadOrder = {
        CardCode: carcode,
        Series: +order.serie,
        // DocDate: order.date.toISOString().replace('T', ' ').substring(0, 10),
        // DocDueDate: order.dueDate.toISOString().replace('T', ' ').substring(0, 10),
        // SalesPersonCode: order.salesPersonCode || '',
        Comments: `${order.comments}\n\n${order.orderDetails.map((d) => `${d.aditionalInfo}\n\n`)}`,
        DiscountPercent: order.discount || 0,
        VatSum: order.vatTotal || 0,
        DocTotal: order.total || 0,
        DocumentLines: order.orderDetails.map((item) => {
          const project = setting.settingDetail.find((d) => d.code == item.project);
          return {
            ItemCode: item.itemCode,
            Quantity: item.amount,
            UnitPrice: item.value,
            DiscountPercent: item.discount || 0,
            // Price: item.value * item.amount,
            WarehouseCode: item.wareHouseCode || null,
            ProjectCode: project.value,
            ArTaxCode: item.arTaxCode,
            CostingCode: codes?.factorCode,
            CostingCode2: codes?.factorCode2,
            COGSCostingCode3: 'VTA',
            COGSCostingCode2: codes?.factorCode2
          };
        })
      }

      const result = await this.orderService.update(order.integrationId.toString(), payloadOrder);

      if (result.status === 200) {
        order.sendToSap = true;
        const orderUpdate = await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: true } });

        // order.orderDetails.map(async (detail) => {
        //   try {
        //     const item = await this.productService.findOne(detail.itemCode, 'QuantityOnStock,QuantityOrderedFromVendors,QuantityOrderedByCustomers');
        //     await this.prismaService.items.updateMany({
        //       where: { code: detail.itemCode }, data: {
        //         quantityOnStock: item.data.QuantityOnStock,
        //         quantityOrderedFromVendors: item.data.QuantityOrderedFromVendors,
        //         quantityOrderedByCustomers: item.data.QuantityOrderedByCustomers
        //       }
        //     });
        //   } catch (error) {
        //     console.log('update item', error);
        //   }
        // });

        this.clientProxi.send('order/change-status-sap', {orderId: order.id});
        this.clientProxi.send('order/get-order-created', {order: orderUpdate});
      } else {
        await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: false, messageError: result.message } });
      }

      return result.data;

    } catch (error) {
      console.log('order/create', {error});
    }

  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @MessagePattern('order/findopenorders')
  async findOpenOrder(@Payload() payload: { startDate: string, endDate: string, salesPersonCode: string }, @Ctx() context: RedisContext) {
    await this.authService.login();
    const result = await this.orderService.getOpenOrders(payload.startDate, payload.endDate, payload.salesPersonCode);
    return result;
  }

  @MessagePattern('order/findordersandcreditnotes')
  async findOrdersAndCreditNotes(@Payload() payload: { startDate: string, endDate: string, salesPersonCode: string }, @Ctx() context: RedisContext) {
    await this.authService.login();
    const result = await this.orderService.getOrdersAndCreditNotes(payload.startDate, payload.endDate, payload.salesPersonCode);
    return result;
  }

  @Post('socket/socket')
  async dddd(@Req() req, @Body() data) {
    this.orderGateway.changeStatus({id: '223uytu37738'}, 'db87b1f4-5daa-4a51-95b8-173385a90491');
    return 'ok';
  }

}
