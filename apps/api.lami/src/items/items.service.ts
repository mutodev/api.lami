import { Injectable } from '@nestjs/common';
import { Items as Model, Prisma } from '@prisma/client';
import { PaginationService } from '../commons/services/pagination/pagination.service';
import { PrismaService } from '../commons/services/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  
  constructor(public prisma: PrismaService,
    private paginationService: PaginationService) {}
  
  async create(data: Prisma.ItemsUncheckedCreateInput): Promise<Model> {
    return this.prisma.items.create({
      data 
    });
  }

  findAll(params: {
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
      return paginate<Model, Prisma.ItemsFindManyArgs>(
        this.prisma.items, {
            cursor,
            where,
            orderBy,
            include: {
              itemsWareHouses: {where: {warehouseCode: wareHouseCode}}
            },
          });
    } else {
      return this.prisma.items.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          itemsWareHouses: {where: {warehouseCode: wareHouseCode}}
        },
      });
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
