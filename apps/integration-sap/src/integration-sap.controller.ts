import { Controller, Get } from '@nestjs/common';
import { IntegrationSapService } from './integration-sap.service';

@Controller('migration')
export class IntegrationSapController {
  constructor(private readonly integrationSapService: IntegrationSapService) {}

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

}
