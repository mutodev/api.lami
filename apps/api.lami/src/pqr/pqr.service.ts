import { Injectable } from '@nestjs/common';
import { PQR as Model, Prisma } from '@prisma/client';
import { PaginationService } from '../commons/services/pagination/pagination.service';
import { PrismaService } from '../commons/services/prisma.service';
import { CreatePqrDto } from './dto/create-pqr.dto';
import { UpdatePqrDto } from './dto/update-pqr.dto';

@Injectable()
export class PqrService {
  constructor(public prisma: PrismaService,
    private paginationService: PaginationService) {}
  
  async create(data: Prisma.PQRUncheckedCreateInput): Promise<Model> {
    return this.prisma.pQR.create({
      data 
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PQRWhereUniqueInput;
    where?: Prisma.PQRWhereInput;
    orderBy?: Prisma.PQROrderByWithRelationInput;
    page?: number,
    perPage?: number,
    wareHouseCode?: string
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy, wareHouseCode } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({page: params.page, perPage: params.perPage });
      const result = await paginate<Model, Prisma.PQRFindManyArgs>(
        this.prisma.pQR, {
            cursor,
            where,
            orderBy,
            // include: {
            //   itemsWareHouses: {where: {warehouseCode: wareHouseCode}}
            // },
          });
      return result
    } else {
      const result = await this.prisma.pQR.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        // include: {
        //   itemsWareHouses: {where: {warehouseCode: wareHouseCode}}
        // },
      });
      return result;
    }
  }

  findOne(pqrWhereUniqueInput: Prisma.PQRWhereUniqueInput): Promise<Model | null> {
    return this.prisma.pQR.findUnique({
      where: pqrWhereUniqueInput,
    });
  }

  update(params: {
    where: Prisma.PQRWhereUniqueInput;
    data: Prisma.PQRUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.pQR.update({
      data,
      where,
    });
  }

  remove(where: Prisma.PQRWhereUniqueInput): Promise<Model> {
    return this.prisma.pQR.delete({
      where
    });
  }

}
