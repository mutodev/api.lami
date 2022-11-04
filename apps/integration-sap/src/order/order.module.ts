import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TaskOrderService } from './task-order/task-order.service';
import { CommonsModule } from '../commons/commons.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CommonsModule,
    AuthModule
  ],
  controllers: [OrderController],
  providers: [OrderService, TaskOrderService]
})
export class OrderModule {}
