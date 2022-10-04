import { Injectable } from '@nestjs/common';
import { Customer as Model , Prisma } from '@prisma/client';
import { PrismaService } from 'src/commons/services/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  
  constructor(public prisma: PrismaService) {}
  
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
  }): Promise<Model[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
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
