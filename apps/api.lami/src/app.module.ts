import { PaginationService } from './commons/services/pagination/pagination.service';
import { CommonsModule } from './commons/commons.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { FinanceModule } from './finance/finance.module';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { SettingModule } from './setting/setting.module';

@Module({
  imports: [
    EasyconfigModule.register({ path: './.env' }),
    UserModule, AuthModule, CustomerModule, OrderModule, FinanceModule, SettingModule],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule { }
