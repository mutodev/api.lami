import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { CustomerService } from './customer/customer.service';
import { IntegrationSapService } from './integration-sap.service';

@Controller('migration')
export class IntegrationSapController {
  constructor(private readonly integrationSapService: IntegrationSapService,
              private readonly customerService: CustomerService,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get('grupos')
  async migrateGrupos() {
    return await this.integrationSapService.migrateGrupos();
  }

  @Get('migratePayTermsGrpCodes')
  async migratePayTermsGrpCodes() {
    return await this.integrationSapService.migratePayTermsGrpCodes();
  }

  @Get('migrateSalesPersonCode')
  async migrateSalesPersonCode() {
    return await this.integrationSapService.migrateSalesPersonCode();
  }

  @Get('migrateItems')
  async migrateItems() {
    return await this.integrationSapService.migrateItems();
  }

  @Get('migrateProject')
  async migrateProject() {
    return await this.integrationSapService.migrateProject();
  }

  @Get('migrateSeries')
  async migrateSeries() {
    return await this.integrationSapService.migrateSeries();
  }

  @Get('migrateCustomers')
  async migrateCustomers() {
    return await this.customerService.migrateCustomers();
  }

  // @Post('cancel/order')
  // async cancelOrder(@Body() payload: {CardCode:  string}) {
  //   return await this.integrationSapService.cancelOrders(payload.CardCode);
  // }

  @MessagePattern('integration/get-sales-person-code')
  async getSalesPersonCode(@Payload() payload: {city: string}, @Ctx() context: RedisContext) {
    const result = await this.integrationSapService.getSalesPersonCode(payload.city);
    return payload.city != 'Todos' ? result.filter((item) => item.city == payload.city) : result;
  }

}
