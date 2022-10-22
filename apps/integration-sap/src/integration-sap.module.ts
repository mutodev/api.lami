import { Module } from '@nestjs/common';
import { IntegrationSapController } from './integration-sap.controller';
import { IntegrationSapService } from './integration-sap.service';
import { CustomerModule } from './customer/customer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './commons/prisma.service';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { WarehoureModule } from './warehoure/warehoure.module';
import { SerieModule } from './serie/serie.module';
import { CommonsModule } from './commons/commons.module';

@Module({
  imports: [
    CommonsModule,
    AuthModule,
    CustomerModule,
    ScheduleModule.forRoot(),
    OrderModule,
    ProductModule,
    WarehoureModule,
    SerieModule
  ],
  controllers: [IntegrationSapController],
  providers: [IntegrationSapService],
  exports: []
})
export class IntegrationSapModule {}
