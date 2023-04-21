import { Injectable } from '@nestjs/common';
import { Prisma, Prices as Model } from '@prisma/client';
import { PaginationService } from '../commons/services/pagination/pagination.service';
import { PrismaService } from '../commons/services/prisma.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';

@Injectable()
export class PricesService {

  constructor(public prisma: PrismaService,
    private paginationService: PaginationService) {

  }

  create(createPriceDto: CreatePriceDto) {
    return this.prisma.prices.create({
      data: createPriceDto
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PricesWhereUniqueInput;
    where?: Prisma.PricesWhereInput;
    orderBy?: Prisma.PricesOrderByWithRelationInput;
    page?: number,
    perPage?: number
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({page: params.page, perPage: params.perPage });
      const result = await paginate<Model, Prisma.PricesFindManyArgs>(
        this.prisma.prices, {
            cursor,
            where,
            orderBy
          });
      return result
    } else {
      const result = await this.prisma.prices.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy
      });
      return result;
    }
  }

  findOne(pricesWhereUniqueInput: Prisma.PricesWhereUniqueInput): Promise<Model | null> {
    return this.prisma.prices.findUnique({
      where: pricesWhereUniqueInput,
    });
  }

  update(params: {
    where: Prisma.PricesWhereUniqueInput;
    data: Prisma.PricesUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.prices.update({
      data,
      where,
    });
  }

  remove(where: Prisma.PricesWhereUniqueInput): Promise<Model> {
    return this.prisma.prices.delete({
      where
    });
  }

}
