import { Injectable } from '@nestjs/common';
import { Items as Model, Prisma } from '@prisma/client';
import { PaginationService } from '../commons/services/pagination/pagination.service';
import { PrismaService } from '../commons/services/prisma.service';
import { calculateEstimateDate } from '../commons/functions';

@Injectable()
export class ItemsService {
  
  constructor(public prisma: PrismaService,
    private paginationService: PaginationService) {}
  
  async create(data: Prisma.ItemsUncheckedCreateInput): Promise<Model> {
    return this.prisma.items.create({
      data 
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ItemsWhereUniqueInput;
    where?: Prisma.ItemsWhereInput;
    orderBy?: Prisma.ItemsOrderByWithRelationInput;
    page?: number,
    perPage?: number,
    wareHouseCode?: string
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy, wareHouseCode } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({page: params.page, perPage: params.perPage });
      const result = await paginate<Model, Prisma.ItemsFindManyArgs>(
        this.prisma.items, {
            cursor,
            where,
            orderBy,
            include: {
              itemsWareHouses: {where: {warehouseCode: wareHouseCode}}
            },
          });
          let list = [];
          let today = new Date();
          result.data.map((item) => {
            const isEspecial = !!item.name.toLowerCase().includes('especial');
            let totalStock = (item.quantityOnStock - (item.quantityOrderedByCustomers || 0)) -3;
            let estimatedDate = calculateEstimateDate(today, totalStock, isEspecial);
            list.push({
              ...item,
              estimatedDate: `${estimatedDate.getFullYear()}-${estimatedDate.getMonth() + 1}-${estimatedDate.getDate()}`
            });
          });
      const {data, ...items} = result    
      return {...items, data: list};
    } else {
      const result = await this.prisma.items.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          itemsWareHouses: {where: {warehouseCode: wareHouseCode}}
        },
      });
      let list = [];
      let today = new Date();
      result.map((item) => {
        const isEspecial = !!item.name.toLowerCase().includes('especial');
        let totalStock = (item.quantityOnStock - (item.quantityOrderedByCustomers || 0)) -3;
        let estimatedDate = calculateEstimateDate(today, totalStock, isEspecial);
        list.push({
          ...item,
          estimatedDate: `${estimatedDate.getFullYear()}-${estimatedDate.getMonth() + 1}-${estimatedDate.getDate()}`
        });
      });
      
      return list;
    }
  }

  findOne(itemsWhereUniqueInput: Prisma.ItemsWhereUniqueInput): Promise<Model | null> {
    return this.prisma.items.findUnique({
      where: itemsWhereUniqueInput,
    });
  }

  update(params: {
    where: Prisma.ItemsWhereUniqueInput;
    data: Prisma.ItemsUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.items.update({
      data,
      where,
    });
  }

  remove(where: Prisma.ItemsWhereUniqueInput): Promise<Model> {
    return this.prisma.items.delete({
      where
    });
  }

  findByCode(code: string): Promise<Model | null> {
    return this.prisma.items.findFirst({
      where: { code }
    });
  }

}
