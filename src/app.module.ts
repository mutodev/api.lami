import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { FinanceModule } from './finance/finance.module';

@Module({
  imports: [UserModule, AuthModule, CustomerModule, OrderModule, FinanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
