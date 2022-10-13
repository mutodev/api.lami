import { Module } from '@nestjs/common';
import { IntegrationSapController } from './integration-sap.controller';
import { IntegrationSapService } from './integration-sap.service';
import { CustomerModule } from './customer/customer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ApiHttp } from './commons/api-http.service';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';

@Module({
  imports: [
    CustomerModule,
    ScheduleModule.forRoot(),
    AuthModule,
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    }),
  ],
  controllers: [IntegrationSapController],
  providers: [IntegrationSapService, ApiHttp],
  exports: [ApiHttp]
})
export class IntegrationSapModule {}
