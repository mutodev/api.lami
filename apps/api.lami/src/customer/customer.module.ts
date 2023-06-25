import { Global, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CommonsModule } from './../commons/commons.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CustomerGateway } from './customer.gateway';

@Global()
@Module({
  imports: [
    CommonsModule,
    ClientsModule.register([
      {
        name: 'CLIENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
          retryAttempts: 3,
          retryDelay: 1000
        }
      }
    ])
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerGateway],
  exports: [CustomerService]
})
export class CustomerModule {}
