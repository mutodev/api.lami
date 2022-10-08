import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TaskCustomerService } from './task-customer/task-customer.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, TaskCustomerService]
})
export class CustomerModule {}
