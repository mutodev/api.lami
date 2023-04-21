import { Injectable } from '@nestjs/common';
import { Prisma, Stores as Model } from '@prisma/client';
import { PaginationService } from '../commons/services/pagination/pagination.service';
import { PrismaService } from '../commons/services/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  /**
   *
   */
  constructor(public prisma: PrismaService,
              private paginationService: PaginationService) {
    
  }

  create(createStoreDto: CreateStoreDto) {
    return this.prisma.stores.create({
      data: createStoreDto
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StoresWhereUniqueInput;
    where?: Prisma.StoresWhereInput;
    orderBy?: Prisma.StoresOrderByWithRelationInput;
    page?: number,
    perPage?: number
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({page: params.page, perPage: params.perPage });
      const result = await paginate<Model, Prisma.StoresFindManyArgs>(
        this.prisma.stores, {
            cursor,
            where,
            orderBy
          });
      return result
    } else {
      const result = await this.prisma.stores.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy
      });
      return result;
    }
  }

  findOne(storeWhereUniqueInput: Prisma.StoresWhereUniqueInput): Promise<Model | null> {
    return this.prisma.stores.findUnique({
      where: storeWhereUniqueInput,
    });
  }

  update(params: {
    where: Prisma.StoresWhereUniqueInput;
    data: Prisma.StoresUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.stores.update({
      data,
      where,
    });
  }

  remove(where: Prisma.StoresWhereUniqueInput): Promise<Model> {
    return this.prisma.stores.delete({
      where
    });
  }

}
