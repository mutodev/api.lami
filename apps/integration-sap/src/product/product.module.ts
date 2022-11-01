import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CommonsModule } from '../commons/commons.module';
import { AuthModule } from '../auth/auth.module';
import { TaskProductService } from './task-product/task-product.service';

@Module({
  imports: [
    CommonsModule,
    AuthModule
  ],
  controllers: [ProductController],
  providers: [ProductService, TaskProductService]
})
export class ProductModule {}
