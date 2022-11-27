import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TaskOrderService } from './task-order/task-order.service';
import { CommonsModule } from '../commons/commons.module';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CommonsModule,
    AuthModule,
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
  providers: [OrderService, TaskOrderService]
})
export class OrderModule {}
