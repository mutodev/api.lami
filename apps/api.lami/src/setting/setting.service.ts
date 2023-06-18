import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Setting as Model, Prisma } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PaginationService } from './../commons/services/pagination/pagination.service';
import { PrismaService } from './../commons/services/prisma.service';

@Injectable()
export class SettingService {

  constructor(public prisma: PrismaService,
    private paginationService: PaginationService,
    @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy) { }

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
      const paginate = this.paginationService.createPaginator({ page: params.page, perPage: params.perPage });
      return paginate<Model, Prisma.SettingFindManyArgs>(
        this.prisma.setting, {
        cursor,
        where,
        orderBy,
        include: {
          settingDetail: { where: { active: true }, orderBy: { name: where.name == 'Project' ? 'desc' : 'asc' } }
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
          settingDetail: { where: { active: true }, orderBy: { name: where.name == 'Project' ? 'desc' : 'asc' } }
        }
      });
    }
  }

  async findOne(settingWhereUniqueInput: Prisma.SettingWhereUniqueInput, salesPersonCode: string) {
    // los que se deben mostrar por ciudad
    if (['PayTermsGrpCode', 'SalesPersonCode', 'CUSTOMER_GROUP', 'SERIES'].includes(settingWhereUniqueInput.name)) {
      const salesCode = await this.prisma.settingDetail.findFirst({ where: { code: salesPersonCode, setting: { name: 'SalesPersonCode' } } });
      let cities = (salesCode.extendedData as Prisma.JsonObject)?.cities as any[];
      return await this.prisma.settingDetail.findMany({
        where: {
          setting: {
            name: settingWhereUniqueInput.name
          },
          extendedData: {
            path: ['cities'],
            array_contains: cities
          },
          active: true
        },
        orderBy: { name: settingWhereUniqueInput.name == 'Project' ? 'desc' : 'asc' }
      })
    } else {
      return await this.prisma.settingDetail.findMany({
        where: {
          setting: {
            name: settingWhereUniqueInput.name
          },
          active: true
        },
        orderBy: { name: settingWhereUniqueInput.name == 'Project' ? 'desc' : 'asc' }
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

  async findSalesPersonCode() {

    // return await this.prisma.setting.findUnique({
    //   where: {name: 'SalesPersonCode'}, 
    //   include: {
    //     settingDetail: { where: {active: true}, orderBy: {name: 'asc'}}
    //   }
    // });
    return await this.prisma.settingDetail.findMany({
      where: {
        setting: { name: 'SalesPersonCode' },
        active: true
      },
      orderBy: { name: 'asc' }
    })

  }

  async findAllDetails(settingWhereUniqueInput: Prisma.SettingWhereUniqueInput, salesPersonCode: string) {
    // los que se deben mostrar por ciudad
    if (['PayTermsGrpCode', 'SalesPersonCode', 'CUSTOMER_GROUP', 'SERIES'].includes(settingWhereUniqueInput.name)) {
      const salesCode = await this.prisma.settingDetail.findFirst({ where: { code: salesPersonCode, setting: { name: 'SalesPersonCode' } } });
      let cities = (salesCode.extendedData as Prisma.JsonObject)?.cities as any[];
      return await this.prisma.settingDetail.findMany({
        where: {
          setting: {
            name: settingWhereUniqueInput.name
          },
          extendedData: {
            path: ['cities'],
            array_contains: cities
          },
          active: true
        },
        orderBy: { name: settingWhereUniqueInput.name == 'Project' ? 'desc' : 'asc' }
      })
    } else {
      return await this.prisma.settingDetail.findMany({
        where: {
          setting: {
            name: settingWhereUniqueInput.name
          },
          active: true
        },
        orderBy: { name: settingWhereUniqueInput.name == 'Project' ? 'desc' : 'asc' }
      });
    }
  }

  async getSalesPersonFromSap(city: string = '') {
    const result = this.clientProxi.send('integration/get-sales-person-code', {city});
    return await firstValueFrom(result);
  }

  async migrateSalesPerson() {
    const result = this.clientProxi.send('integration-salesperson/migrate', null);
    return await firstValueFrom(result);
  }

}