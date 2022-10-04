import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CommonsModule } from 'src/commons/commons.module';

@Module({
  imports: [
    CommonsModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
