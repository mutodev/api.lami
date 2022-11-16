import { Injectable } from '@nestjs/common';
import { Setting as Model, Prisma } from '@prisma/client';
import { PaginationService } from './../commons/services/pagination/pagination.service';
import { PrismaService } from './../commons/services/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingService {

  constructor(public prisma: PrismaService,
              private paginationService: PaginationService) {}

  async create(data: Prisma.SettingCreateInput): Promise<Model> {
    return this.prisma.setting.create({
      data
    });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SettingWhereUniqueInput;
    where?: Prisma.SettingWhereInput;
    orderBy?: Prisma.SettingOrderByWithRelationInput;
    page?: number,
    perPage?: number
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({page: params.page, perPage: params.perPage });
      return paginate<Model, Prisma.SettingFindManyArgs>(
        this.prisma.setting, {
            cursor,
            where,
            orderBy,
            include: {
              settingDetail: { where: {active: true}}
            }
          });
    } else {
      return this.prisma.setting.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          settingDetail: { where: {active: true}}
        }
      });
    }
  }

  findOne(userWhereUniqueInput: Prisma.SettingWhereUniqueInput): Promise<Model | null> {
    return this.prisma.setting.findUnique({
      where: userWhereUniqueInput,
      include: {
        settingDetail: { where: {active: true}}
      }
    });
  }

  update(params: {
    where: Prisma.SettingWhereUniqueInput;
    data: Prisma.SettingUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.setting.update({
      data,
      where,
    });
  }

  remove(where: Prisma.SettingWhereUniqueInput): Promise<Model> {
    return this.prisma.setting.delete({
      where
    });
  }

}
