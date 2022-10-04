import { Global, Injectable } from '@nestjs/common';
import { PrismaService } from './../commons/services/prisma.service';
import {
  User as Model,
  Prisma
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Global()
@Injectable()
export class UserService {
  
  constructor(public prisma: PrismaService) {}
  
  async create(data: Prisma.UserCreateInput): Promise<Model> {
    const salt = await bcrypt.genSalt(10);
    const passwordCrypt = bcrypt.hashSync(data.password, salt);
    data.password = passwordCrypt;
    return this.prisma.user.create({
      data
    });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Model[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<Model | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
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

}
