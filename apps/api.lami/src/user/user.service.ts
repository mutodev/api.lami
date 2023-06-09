import { Global, Injectable } from '@nestjs/common';
import { PrismaService } from './../commons/services/prisma.service';
import {
  User as Model,
  Prisma
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PaginationService } from './../commons/services/pagination/pagination.service';

@Global()
@Injectable()
export class UserService {
  
  constructor(public prisma: PrismaService,
              private paginationService: PaginationService) {}
  
  async create(data: Prisma.UserUncheckedCreateInput): Promise<Model> {
    try {
      const user = await this.prisma.user.findUnique({where: {userName: data.userName}});
      if (user) 
        throw "El usuario ya existe.";
      const salt = await bcrypt.genSalt(10);
      const passwordCrypt = bcrypt.hashSync(data.password, salt);
      data.password = passwordCrypt;
      return this.prisma.user.create({
        data
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    page?: number,
    perPage?: number
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({page: params.page, perPage: params.perPage });
      const result = await paginate<Model, Prisma.UserFindManyArgs>(
        this.prisma.user, {
            cursor,
            where,
            orderBy,
            include: {role: true}
          });
          result.data = await Promise.all(result.data.map(async (item) => {
            let setting = {};
            if (item.salesPersonCode)
              setting = await this.prisma.settingDetail.findFirst({where: {setting: {name: 'SalesPersonCode',}, code: item.salesPersonCode}});
            return {...item, salesPerson: setting};
          }))
          return result;
    } else {
      let result = await this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {role: true}
      });
      return await Promise.all(result.map(async (item) => {
        let setting = {};
        if (item.salesPersonCode)
          setting = await this.prisma.settingDetail.findFirst({where: {setting: {name: 'SalesPersonCode',}, code: item.salesPersonCode}});
        return {...item, salesPerson: setting};
      }));
    }
  }

  findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<Model | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: {
        role: true
      }
    });
  }

  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  remove(where: Prisma.UserWhereUniqueInput): Promise<Model> {
    return this.prisma.user.delete({
      where
    });
  }

  findFirst(userWhereInput: Prisma.UserWhereInput): Promise<Model | null> {
    return this.prisma.user.findFirst({where: userWhereInput, include: {role: true}});
  }

  async updatePassword(id: string, password: string): Promise<Model> {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordCrypt = bcrypt.hashSync(password, salt);
      return await this.prisma.user.update({where: {id}, data: {password: passwordCrypt}});
    } catch (error) {
      throw error;
    }
  }

}
