import { CommonsModule } from './commons/commons.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { FinanceModule } from './finance/finance.module';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { SettingModule } from './setting/setting.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    EasyconfigModule.register({ path: './.env' }),
    UserModule, 
    AuthModule, 
    CustomerModule, 
    OrderModule, 
    FinanceModule, 
    SettingModule, 
    ItemsModule,
    ClientsModule.register([
      {
        name: 'CLIENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379
        }
      }
    ])],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule { }
