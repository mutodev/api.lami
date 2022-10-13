import { Controller, Get } from '@nestjs/common';
import { IntegrationSapService } from './integration-sap.service';

@Controller()
export class IntegrationSapController {
  constructor(private readonly integrationSapService: IntegrationSapService) {}

  // @Get()
  // getHello(): string {
  //   return this.integrationSapService.getHello();
  // }
}
