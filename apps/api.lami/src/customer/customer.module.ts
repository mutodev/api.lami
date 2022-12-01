import { Global, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CommonsModule } from './../commons/commons.module';

@Global()
@Module({
  imports: [
    CommonsModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService]
})
export class CustomerModule {}
