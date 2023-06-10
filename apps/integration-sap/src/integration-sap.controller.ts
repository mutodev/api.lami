import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerService } from './customer/customer.service';
import { IntegrationSapService } from './integration-sap.service';

@Controller('migration')
export class IntegrationSapController {
  constructor(private readonly integrationSapService: IntegrationSapService,
              private readonly customerService: CustomerService) {}

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

}
