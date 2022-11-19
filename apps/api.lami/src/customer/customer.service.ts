import { Injectable } from '@nestjs/common';
import { Customer as Model , Prisma } from '@prisma/client';
import { PaginationService } from './../commons/services/pagination/pagination.service';
import { PrismaService } from './../commons/services/prisma.service';

@Injectable()
export class CustomerService {
  
  constructor(public prisma: PrismaService,
    private paginationService: PaginationService) {}
  
  async create(data: Prisma.CustomerUncheckedCreateInput): Promise<Model> {
    try {
      const cus = await this.prisma.customer.findFirst({
        where: {OR: 
          [
            {identification: data.identification}, 
            {identification: `CL-${data.identification}`}
          ]
        }});
      if (cus) {
        throw "El cliente o el posible cliente ya existe.";
      }        
      const {identification, ...customer} = data;
      return await this.prisma.customer.create({
        data: {...customer, 
        identification: data.source == 'C' ? `CL-${identification}` : data.identification, 
        cardType: customer.source,
        FederalTaxID: identification
        }
      });
    } catch (error) {
      throw error;
    }    
  }

  findAll(params: {
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
      const paginate = this.paginationService.createPaginator({page: params.page, perPage: params.perPage });
      return paginate<Model, Prisma.CustomerFindManyArgs>(
        this.prisma.customer, {
            cursor,
            where,
            orderBy,
            include: {type: true, identificationType: true}
          });
    } else {
      return this.prisma.customer.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {type: true, identificationType: true}
      });
    }
  }

  findOne(userWhereUniqueInput: Prisma.CustomerWhereUniqueInput): Promise<Model | null> {
    return this.prisma.customer.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async update(params: {
    where: Prisma.CustomerWhereUniqueInput;
    data: Prisma.CustomerUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    const cus = await this.prisma.customer.findUnique({where: {id: where.id}});
    const {identification, ...customer} = data;
    let newIdentification = data.source == 'C' && !identification.toString().includes('CL') ? `CL-${identification}` : identification;
    return await this.prisma.customer.update({
      data: {...customer, identification: newIdentification , sendToSap: false, codeUpdated: cus.identification},
      where,
    });
  }

  remove(where: Prisma.CustomerWhereUniqueInput): Promise<Model> {
    return this.prisma.customer.delete({
      where
    });
  }

  async getOrder(id: string) {
    const setting = await this.prisma.setting.findUnique({where: {name: 'STATUS_ORDER'}});
    const result = await this.prisma.settingDetail.findMany({
      where: {settingId: setting.id},
      include: {
        orders: {
          where: {customerId: id}
        }
      }
    });
    return result.map((item) => {
      return {...item, ordersCount: item.orders.length};
    });
  }

}
