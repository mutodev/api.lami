import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CommonsModule } from '../commons/commons.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderGateway } from './order.gateway';

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
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
