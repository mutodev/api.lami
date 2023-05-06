import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Customer as Model, Prisma } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { EnumCustomerType } from '../commons/enums/enum-customer-type';
import { seeEventCustomerStream } from '../commons/streams/actions-order';
import { PaginationService } from './../commons/services/pagination/pagination.service';
import { PrismaService } from './../commons/services/prisma.service';

@Injectable()
export class CustomerService {

  constructor(public prisma: PrismaService,
    private paginationService: PaginationService,
    @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy) { }

  async create(data: Prisma.CustomerUncheckedCreateInput): Promise<Model> {
    try {
      const cus = await this.prisma.customer.findFirst({
        where: {
          OR:
            [
              { identification: data.identification },
              { identification: `CL-${data.identification}` }
            ]
        }
      });
      if (cus) {
        throw "El cliente o el posible cliente ya existe.";
      }
      const { identification, name, ...customer } = data;
      let nameV = data.typeId == EnumCustomerType.PersonaNatural ? `${data.firstName} ${data.lastName}` : data.name;

      let U_HBT_MunMed = '';
      if (data.source == 'C') {
        const setting = await this.prisma.setting.findUnique({ where: { name: 'CITIES', }, include: { settingDetail: { where: { name: data.CityBilling.toString(), value: data.CountyBilling.toString() } } } });
        if (setting.settingDetail.length > 0) {
          U_HBT_MunMed = setting.settingDetail[0].value2;
        }
      }

      return await this.prisma.customer.create({
        data: {
          ...customer,
          identification: `CL-${identification}`,
          cardType: customer.source,
          FederalTaxID: identification,
          name: nameV,
          U_HBT_MunMed,
          codeUpdated: `CL-${identification}`,
          sendToSap: null
        },
        include: {identificationType: true}
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CustomerWhereUniqueInput;
    where?: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByWithRelationInput;
    page?: number,
    perPage?: number
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({ page: params.page, perPage: params.perPage });
      const result = await paginate<Model, Prisma.CustomerFindManyArgs>(
        this.prisma.customer, {
        cursor,
        where,
        orderBy,
        include: { type: true, identificationType: true }
      });

      const list = result.data.map((item) => {
        const { identification, ...l } = item;
        return { ...l, identification: l.source == 'L' ? identification.replace('CL-', '') : identification };
      });
      result.data = list;
      return result;
    } else {
      const result = await this.prisma.customer.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: { type: true, identificationType: true }
      });
      const list = result.map((item) => {
        const { identification, ...l } = item;
        return { ...l, identification: l.source == 'L' ? identification.replace('CL-', '') : identification };
      });
      return list;
    }
  }

  async findOne(userWhereUniqueInput: Prisma.CustomerWhereUniqueInput): Promise<Model | null> {
    const result = await this.prisma.customer.findUnique({
      where: userWhereUniqueInput,
      include: {identificationType: true}
    });
    const { identification, ...data } = result;
    return { ...data, identification: data.source == 'L' ? identification.replace('CL-', '') : identification };
  }

  async update(params: {
    where: Prisma.CustomerWhereUniqueInput;
    data: Prisma.CustomerUncheckedUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    const cus = await this.prisma.customer.findUnique({ where: { id: where.id } });
    const { identification, name, ...customer } = data;
    // let newIdentification = cus.source == 'L' ? `CL-${identification}` : identification;
    let nameV = data.typeId == EnumCustomerType.PersonaNatural ? `${data.firstName} ${data.lastName}` : data.name;

    let U_HBT_MunMed = '';
    if (data.source == 'C') {
      const setting = await this.prisma.setting.findUnique({ where: { name: 'CITIES', }, include: { settingDetail: { where: { name: data.CityBilling.toString(), value: data.CountyBilling.toString() } } } });
      if (setting.settingDetail.length > 0) {
        U_HBT_MunMed = setting.settingDetail[0].value2;
      }
    }

    return await this.prisma.customer.update({
      data: { ...customer, name: nameV, sendToSap: null, codeUpdated: cus.identification, cardType: customer.source, U_HBT_MunMed },
      where,
    });
  }

  remove(where: Prisma.CustomerWhereUniqueInput): Promise<Model> {
    return this.prisma.customer.delete({
      where
    });
  }

  async getOrder(id: string) {
    const setting = await this.prisma.setting.findUnique({ where: { name: 'STATUS_ORDER' } });
    const result = await this.prisma.settingDetail.findMany({
      where: { settingId: setting.id },
      include: {
        orders: {
          where: { customerId: id }
        }
      }
    });
    return result.map((item) => {
      return { ...item, ordersCount: item.orders.length };
    });
  }

  async findAllSap(dato: string, skip: number = 0) {
    const result = await this.clientProxi.send('customer/findall/select', { dato, skip });
    const orderSap = await firstValueFrom(result);
    return orderSap.value.map((c) => {
      return {
        identification: c.CardCode,
        name: c.CardName,
        project: c.ProjectCode,
        address: c.Address,
        phone: c.Phone1
      }
    });
  }

  async findFromSap(carCode: string) {
    const result = await this.clientProxi.send('customer/findone', carCode);
    return await firstValueFrom(result);
  }

  async createFromIntegration(data: Prisma.CustomerUncheckedCreateInput) {
    try {
      const count = await this.prisma.customer.count({
        where: {
          OR:
            [
              { identification: data.identification },
              { identification: `CL-${data.identification}` }
            ]
        }
      });
      if (count == 0) {
        const { identification, name, ...customer } = data;
        let nameV = data.typeId == EnumCustomerType.PersonaNatural ? `${data.firstName} ${data.lastName}` : data.name;

        let U_HBT_MunMed = '';
        if (data.source == 'C') {
          const setting = await this.prisma.setting.findUnique({ where: { name: 'CITIES', }, include: { settingDetail: { where: { name: data?.CityBilling?.toString(), value: data?.CountyBilling?.toString() } } } });
          if (setting.settingDetail.length > 0) {
            U_HBT_MunMed = setting.settingDetail[0].value2;
            console.log({U_HBT_MunMed})
          }
        }

        await this.prisma.customer.create({
          data: {
            ...customer,
            identification: identification, //identification.includes('CL') ? identification : `CL-${identification}`,
            cardType: customer.source,
            FederalTaxID: identification?.replace('CL', '')?.replace('-', '')?.trim(),
            name: nameV,
            U_HBT_MunMed: U_HBT_MunMed || '',
            codeUpdated: identification//identification.includes('CL') ? identification : `CL-${identification}`,
          }
        });
      }
    } catch (error) {
      throw error;
    }
  }

}
