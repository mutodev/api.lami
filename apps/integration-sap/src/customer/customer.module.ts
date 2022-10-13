import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TaskCustomerService } from './task-customer/task-customer.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { CommonsModule } from '../commons/commons.module';

@Module({
  imports: [
    CommonsModule,
    AuthModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService, TaskCustomerService]
})
export class CustomerModule {}
