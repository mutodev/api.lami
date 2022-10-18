import { Injectable } from '@nestjs/common';
import { Order as Model , Prisma } from '@prisma/client';
import { PaginationService } from './../commons/services/pagination/pagination.service';
import { PrismaService } from './../commons/services/prisma.service';

@Injectable()
export class OrderService {
  constructor(public prisma: PrismaService,
    private paginationService: PaginationService) {}
  
  async create(data: Prisma.OrderUncheckedCreateInput): Promise<Model> {
    console.log({data: JSON.stringify(data)})
    return this.prisma.order.create({
      data
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
      const paginate = this.paginationService.createPaginator({page: params.page, perPage: params.perPage });
      return paginate<Model, Prisma.OrderFindManyArgs>(
        this.prisma.order, {
            cursor,
            where,
            orderBy,
            include: {customer: true}
          });
    } else {
      return this.prisma.order.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {customer: true}
      });
    }
  }

  findOne(userWhereUniqueInput: Prisma.OrderWhereUniqueInput): Promise<Model | null> {
    return this.prisma.order.findUnique({
      where: userWhereUniqueInput,
    });
  }

  update(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.order.update({
      data,
      where,
    });
  }

  remove(where: Prisma.OrderWhereUniqueInput): Promise<Model> {
    return this.prisma.order.delete({
      where
    });
  }
}
