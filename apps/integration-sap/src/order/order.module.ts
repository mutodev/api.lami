import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TaskOrderService } from './task-order/task-order.service';
import { CommonsModule } from '../commons/commons.module';

@Module({
  imports: [
    CommonsModule
  ],
  controllers: [OrderController],
  providers: [OrderService, TaskOrderService]
})
export class OrderModule {}
