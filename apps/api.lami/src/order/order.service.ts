import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order as Model, Prisma } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PaginationService } from './../commons/services/pagination/pagination.service';
import { PrismaService } from './../commons/services/prisma.service';

@Injectable()
export class OrderService {
  constructor(public prisma: PrismaService,
    private paginationService: PaginationService,
    @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy) { }

  async create(data: Prisma.OrderUncheckedCreateInput): Promise<Model> {
    console.log({ data: JSON.stringify(data) })
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
        include: { customer: {include: {identificationType: true}}, status: true }
      });
    } else {
      return this.prisma.order.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: { customer: {include: {identificationType: true}}, status: true }
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
      return {...d, taxObj: tax, projectObj: project};
    });
    let setting = {}; 
    if (order.salesPersonCode)
      setting = await this.prisma.settingDetail.findFirst({where: {setting: {name: 'SalesPersonCode',}, code: order.salesPersonCode}});
    const {orderDetails, ...orderObj} = order;
    return {...orderObj, orderDetails: detail, salesPerson: setting};
  }

  update(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUncheckedUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.order.update({
      data: {...data, sendToSap: null},
      where,
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
    const result = await this.clientProxi.emit('order/findone', order.integrationId);
    const orderSap = await firstValueFrom(result);
    let data = {
      date: orderSap.DocDate,
      dueDate: orderSap.DocDueDate,
      vatTotal: orderSap.VatSum,
      total: orderSap.DocTotal,
      discount: orderSap.DiscountPercent,
      comments: orderSap.Comments,
      serie: ''+orderSap.Series,
      salesPersonCode: orderSap.SalesPersonCode,
      orderDetails: orderSap.DocumentLines.map((item) => {
        return {
          itemCode: item.ItemCode,
          description: item.ItemDescription,
          discount: item.DiscountPercent,
          amount: item.Quantity,
          value: item.UnitPrice,
          wareHouseCode: item.WarehouseCode,
          arTaxCode: item.ArTaxCode
        }
      })
    }
  //  return orderSap;
    return this.prisma.order.update({
      data: {...data, sendToSap: null},
      where
    });
  }
  
}
