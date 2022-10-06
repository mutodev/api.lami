import { Injectable } from '@nestjs/common';
import { Customer as Model , Prisma } from '@prisma/client';
import { PaginationService } from 'src/commons/services/pagination/pagination.service';
import { PrismaService } from 'src/commons/services/prisma.service';

@Injectable()
export class CustomerService {
  
  constructor(public prisma: PrismaService,
    private paginationService: PaginationService) {}
  
  async create(data: Prisma.CustomerCreateInput): Promise<Model> {
    return this.prisma.customer.create({
      data
    });
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
            orderBy
          });
    } else {
      return this.prisma.customer.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    }
  }

  findOne(userWhereUniqueInput: Prisma.CustomerWhereUniqueInput): Promise<Model | null> {
    return this.prisma.customer.findUnique({
      where: userWhereUniqueInput,
    });
  }

  update(params: {
    where: Prisma.CustomerWhereUniqueInput;
    data: Prisma.CustomerUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.customer.update({
      data,
      where,
    });
  }

  remove(where: Prisma.CustomerWhereUniqueInput): Promise<Model> {
    return this.prisma.customer.delete({
      where
    });
  }

}
