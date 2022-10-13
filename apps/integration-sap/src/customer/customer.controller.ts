import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern('customer/create')
  create(@Payload() createCustomerDto: CreateCustomerDto, @Ctx() context: RedisContext) {
    return this.customerService.create(createCustomerDto);
  }

  @MessagePattern('customer/findall')
  findAll(@Ctx() context: RedisContext) {
    return this.customerService.findAll();
  }

  @MessagePattern('customer/findone')
  findOne(@Payload() cardCode: string, @Ctx() context: RedisContext) {
    return this.customerService.findOne(cardCode);
  }

  @MessagePattern('customer/update')
  update(@Payload() updateCustomerDto: UpdateCustomerDto, @Ctx() context: RedisContext) {
    const {CardCode, ...customer} = updateCustomerDto;
    return this.customerService.update(CardCode, customer);
  }

  @MessagePattern('customer/remove')
  remove(@Payload() cardCode: string, @Ctx() context: RedisContext) {
    return this.customerService.remove(cardCode);
  }

}
