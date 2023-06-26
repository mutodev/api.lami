import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order as Model, Prisma } from '@prisma/client';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import { createPdf } from '../commons/functions';
import { CustomerService } from '../customer/customer.service';
import { PaginationService } from './../commons/services/pagination/pagination.service';
import { PrismaService } from './../commons/services/prisma.service';

@Injectable()
export class OrderService {
  constructor(public prisma: PrismaService,
    private paginationService: PaginationService,
    private customerService: CustomerService,
    @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy) { }

  async create(data: Prisma.OrderUncheckedCreateInput): Promise<Model> {
    // console.log({ data: JSON.stringify(data) })
    return this.prisma.order.create({
      data: {
        ...data,
        sendToSap: null
      }
    });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderWhereUniqueInput;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
    page?: number,
    perPage?: number
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({ page: params.page, perPage: params.perPage });
      return paginate<Model, Prisma.OrderFindManyArgs>(
        this.prisma.order, {
        cursor,
        where,
        orderBy,
        include: { customer: { include: { identificationType: true } }, status: true }
      });
    } else {
      return this.prisma.order.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: { customer: { include: { identificationType: true } }, status: true }
      });
    }
  }

  async findOne(userWhereUniqueInput: Prisma.OrderWhereUniqueInput): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: userWhereUniqueInput,
      include: {
        customer: true,
        orderDetails: true,
        status: true
      }
    });
    const projects = await this.prisma.setting.findUnique({
      where: {
        name: 'Project'
      },
      include: {
        settingDetail: true
      }
    });

    const taxes = await this.prisma.setting.findUnique({
      where: {
        name: 'TAX'
      },
      include: {
        settingDetail: true
      }
    });

    const detail = order.orderDetails.map((d) => {
      const project = projects.settingDetail.find((p) => p.code == d.project);
      const tax = taxes.settingDetail.find((p) => p.code == d.arTaxCode);
      return { ...d, taxObj: tax, projectObj: project };
    });
    let setting = {};
    const serie = await this.prisma.settingDetail.findFirst({ where: { setting: { name: 'SERIES' }, code: order.serie } });
    if (order.salesPersonCode)
      setting = await this.prisma.settingDetail.findFirst({ where: { setting: { name: 'SalesPersonCode', }, code: order.salesPersonCode } });
    const { orderDetails, ...orderObj } = order;
    return { ...orderObj, orderDetails: detail, salesPerson: setting, serieObj: serie };
  }

  async update(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUncheckedUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    await this.prisma.orderDetail.deleteMany({ where: { orderId: where.id } });
    return this.prisma.order.update({
      data: { ...data, sendToSap: null },
      where
    });
  }

  remove(where: Prisma.OrderWhereUniqueInput): Promise<Model> {
    return this.prisma.order.delete({
      where
    });
  }

  async updateFromSap(params: {
    where: Prisma.OrderWhereUniqueInput;
  }) {

    const { where } = params;
    const order = await this.prisma.order.findUnique({
      where,
      include: {
        customer: true,
        orderDetails: true,
        status: true
      }
    });

    const result = await this.clientProxi.send('order/findone', { orderCode: order.integrationId });
    const orderSap = await firstValueFrom(result);
    if (orderSap && orderSap.DocumentStatus === 'bost_Open') {

      let data = {
        date: new Date(orderSap.DocDate),
        dueDate: new Date(orderSap.DocDueDate),
        vatTotal: orderSap.VatSum,
        total: orderSap.DocTotal,
        discount: orderSap.DiscountPercent,
        comments: orderSap.Comments,
        serie: '' + orderSap.Series,
        salesPersonCode: '' + orderSap.SalesPersonCode,
        // orderDetails: 
      }
      //  return orderSap;
      await this.prisma.order.update({
        data: { ...data, sendToSap: order.sendToSap },
        where
      });

      await this.prisma.orderDetail.deleteMany({ where: { orderId: order.id } });
      await Promise.all(orderSap.DocumentLines.map(async (item) => {
        const customer = await this.customerService.findOne({ id: order.customerId });
        const data = {
          orderId: order.id,
          itemCode: item.ItemCode,
          description: item.ItemDescription,
          discount: item.DiscountPercent || 0,
          amount: item.Quantity,
          value: item.UnitPrice,
          wareHouseCode: item.WarehouseCode,
          arTaxCode: item.TaxCode || '',
          vat: item.TaxTotal,
          project: customer.project,
          aditionalInfo: '',
          lineNumber: item.LineNum
        };
        await this.prisma.orderDetail.create({
          data: { ...data }
        });
        // console.log({data})
      }));
    }

  }

  async getOrdersAndCreditNotes(startDate: string, endDate: string, salesPersonCode: string) {
    const result = await this.clientProxi.send('order/findordersandcreditnotes', { startDate, endDate, salesPersonCode });
    return await firstValueFrom(result);
  }

  async getOpenOrders(startDate: string, endDate: string, salesPersonCode: string) {
    const result = await this.clientProxi.send('order/findopenorders', { startDate, endDate, salesPersonCode });
    return await firstValueFrom(result);
  }

  async generatePdf(where: Prisma.QuoteWhereUniqueInput) {
    try {
      const order = await this.prisma.order.findUnique({
        where,
        include: {
          customer: true,
          orderDetails: true,
        }
      });
      const projects = await this.prisma.setting.findUnique({
        where: {
          name: 'Project'
        },
        include: {
          settingDetail: true
        }
      });

      const taxes = await this.prisma.setting.findUnique({
        where: {
          name: 'TAX'
        },
        include: {
          settingDetail: true
        }
      });
      const detail = order.orderDetails.map((d) => {
        const project = projects.settingDetail.find((p) => p.code == d.project);
        const tax = taxes.settingDetail.find((p) => p.code == d.arTaxCode);
        return { ...d, taxObj: tax, projectObj: project };
      });

      let setting = await this.prisma.settingDetail.findFirst({ where: { setting: { name: 'SalesPersonCode', }, code: order.salesPersonCode } });
      let city: string = (setting?.extendedData as any)?.cities[0]
      let store = await this.prisma.stores.findFirst({
        where: { name: { contains: city.toLowerCase(), mode: 'insensitive' } }
      }); console.log({ store })
      const { orderDetails, ...orderObj } = order;
      return await createPdf(join(__dirname, "./templates/order.ejs"), { ...orderObj, store, orderDetails: detail, salesPerson: setting });
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  async findCustomerByOrder(userWhereUniqueInput: Prisma.OrderWhereUniqueInput): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: userWhereUniqueInput,
      select: { id: true, customer: true },
      // include: {
      //   customer: true
      // }
    });
    return order.customer;
  }

  async findDetailByOrder(userWhereUniqueInput: Prisma.OrderWhereUniqueInput): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: userWhereUniqueInput,
      select: { id: true, orderDetails: true }
    });
    return order.orderDetails;
  }

}
