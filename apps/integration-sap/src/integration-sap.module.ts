import { Module } from '@nestjs/common';
import { IntegrationSapController } from './integration-sap.controller';
import { IntegrationSapService } from './integration-sap.service';
import { CustomerModule } from './customer/customer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './commons/prisma.service';

@Module({
  imports: [
    AuthModule,
    CustomerModule,
    ScheduleModule.forRoot()
  ],
  controllers: [IntegrationSapController],
  providers: [IntegrationSapService],
  exports: []
})
export class IntegrationSapModule {}
