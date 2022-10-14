import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../commons/prisma.service';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService,
              private prismaService: PrismaService,
              private authService: AuthService) {}

  @Get(':id')
  async byId(@Param('id') id: string) {
    await this.authService.login();
    return await this.customerService.findOne(id);
  }


  @Get()
  async all(@Param('id') id: string) {
    await this.authService.login();
    return await this.customerService.findAll();
  }


  @Get('migrate/:id')
  async migrate(@Param('id') id: string) {
    await this.authService.login();
    const result = await this.customerService.findAll();
    result.data.value.map(async (c) => {
      this.prismaService.customer.findFirst({where: {identification: c.CardCode}});
    })
  }

  @MessagePattern('customer/create')
  create(@Payload() createCustomerDto: CreateCustomerDto, @Ctx() context: RedisContext) {
    return this.customerService.create(createCustomerDto);
  }

  @MessagePattern('customer/findall')
  async findAll(@Ctx() context: RedisContext) {
    return await this.customerService.findAll();
  }

  @MessagePattern('customer/findone')
  async findOne(@Payload() cardCode: string, @Ctx() context: RedisContext) {
    return await this.customerService.findOne(cardCode);
  }

  @MessagePattern('customer/update')
  async update(@Payload() updateCustomerDto: UpdateCustomerDto, @Ctx() context: RedisContext) {
    const {CardCode, ...customer} = updateCustomerDto;
    return await this.customerService.update(CardCode, customer);
  }

  @MessagePattern('customer/remove')
  async remove(@Payload() cardCode: string, @Ctx() context: RedisContext) {
    return await this.customerService.remove(cardCode);
  }

}
