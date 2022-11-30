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
              settingDetail: { where: {active: true}, orderBy: {name: where.name == 'Project' ? 'desc' : 'asc'}}
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
          settingDetail: { where: {active: true}, orderBy: {name: where.name == 'Project' ? 'desc' : 'asc'}}
        }
      });
    }
  }

  async findOne(settingWhereUniqueInput: Prisma.SettingWhereUniqueInput, salesPersonCode?: string): Promise<Model | null> {
    if (['PayTermsGrpCode', 'SalesPersonCode', 'CUSTOMER_GROUP'].includes(settingWhereUniqueInput.name)) {
      const salesCode = await this.prisma.settingDetail.findFirst({ where: {code: salesPersonCode, setting: {name: 'SalesPersonCode'}}});
      let cities = (salesCode.extendedData as Prisma.JsonObject)?.cities as any[];
      console.log({cities})
      return await this.prisma.setting.findUnique({
        where: settingWhereUniqueInput, 
        include: {
          settingDetail: { where: {
            OR: [
              ...cities?.map((item: string) => {
                return  {extendedData: {
                  path: ['cities'],
                  string_contains: item
                  }};
              })], active: true}, 
            orderBy: {name: settingWhereUniqueInput.name == 'Project' ? 'desc' : 'asc'}
          }
        }
      });
    } else {
      return await this.prisma.setting.findUnique({
        where: settingWhereUniqueInput, 
        include: {
          settingDetail: { where: {active: true}, orderBy: {name: settingWhereUniqueInput.name == 'Project' ? 'desc' : 'asc'}}
        }
      });
    }
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

  async findSalesPersonCode(): Promise<Model | null> {
   
    return await this.prisma.setting.findUnique({
      where: {name: 'SalesPersonCode'}, 
      include: {
        settingDetail: { where: {active: true}, orderBy: {name: 'asc'}}
      }
    });
    
  }

}
