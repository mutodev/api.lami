import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
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
  async all(@Request() req, @Param('id') id: string) {
    await this.authService.login();
    return await this.customerService.findAll(req['query']?.dato, req['query']?.skip);
  }


  @Get('migrate/:id')
  async migrate(@Request() req, @Param('id') id: string) {
    await this.authService.login();
    const result = await this.customerService.findAll(req['query']?.dato, req['query']?.skip);
    result.data.value.map(async (c) => {
      this.prismaService.customer.findFirst({where: {identification: c.CardCode}});
    })
  }

  @MessagePattern('customer/create')
  create(@Payload() createCustomerDto: CreateCustomerDto, @Ctx() context: RedisContext) {
    return this.customerService.create(createCustomerDto);
  }

  @MessagePattern('customer/findall')
  async findAll(@Payload() payload: {dato: string, skip: number}, @Ctx() context: RedisContext) {
    return await this.customerService.findAll(payload.dato, payload.skip);
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

  @MessagePattern('customer/findall/select')
  async findAllSelect(@Payload() payload: {dato: string, skip: number}, @Ctx() context: RedisContext) {
    await this.authService.login();
    return await this.customerService.findAllSelect(payload.dato, payload.skip);
  }

}
