import { Module } from '@nestjs/common';
import { IntegrationSapController } from './integration-sap.controller';
import { IntegrationSapService } from './integration-sap.service';
import { CustomerModule } from './customer/customer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CustomerModule,
    ScheduleModule.forRoot(),
    AuthModule
  ],
  controllers: [IntegrationSapController],
  providers: [IntegrationSapService],
})
export class IntegrationSapModule {}
