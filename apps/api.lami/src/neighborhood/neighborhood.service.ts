import { Injectable } from '@nestjs/common';
import { Prisma, Neighborhood as Model } from '@prisma/client';
import { PaginationService } from '../commons/services/pagination/pagination.service';
import { PrismaService } from '../commons/services/prisma.service';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';

@Injectable()
export class NeighborhoodService {

  constructor(public prisma: PrismaService,
    private paginationService: PaginationService) {

  }

  create(createNeighborhoodDto: CreateNeighborhoodDto) {
    return this.prisma.neighborhood.create({
      data: createNeighborhoodDto
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.NeighborhoodWhereUniqueInput;
    where?: Prisma.NeighborhoodWhereInput;
    orderBy?: Prisma.NeighborhoodOrderByWithRelationInput;
    page?: number,
    perPage?: number
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({page: params.page, perPage: params.perPage });
      const result = await paginate<Model, Prisma.NeighborhoodFindManyArgs>(
        this.prisma.neighborhood, {
            cursor,
            where,
            orderBy
          });
      return result
    } else {
      const result = await this.prisma.neighborhood.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy
      });
      return result;
    }
  }

  findOne(neighborhoodWhereUniqueInput: Prisma.NeighborhoodWhereUniqueInput): Promise<Model | null> {
    return this.prisma.neighborhood.findUnique({
      where: neighborhoodWhereUniqueInput,
    });
  }

  update(params: {
    where: Prisma.NeighborhoodWhereUniqueInput;
    data: Prisma.NeighborhoodUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.neighborhood.update({
      data,
      where,
    });
  }

  remove(where: Prisma.NeighborhoodWhereUniqueInput): Promise<Model> {
    return this.prisma.neighborhood.delete({
      where
    });
  }

  async findByCityAndState(state: string, city: string): Promise<Model[]> {
    return await this.prisma.neighborhood.findMany({where: {state, city}});
  }


}
