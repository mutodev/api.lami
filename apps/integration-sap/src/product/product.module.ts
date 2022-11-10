import { Global, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CommonsModule } from '../commons/commons.module';
import { AuthModule } from '../auth/auth.module';
import { TaskProductService } from './task-product/task-product.service';

@Global()
@Module({
  imports: [
    CommonsModule,
    AuthModule
  ],
  controllers: [ProductController],
  providers: [ProductService, TaskProductService],
  exports: [ProductService]
})
export class ProductModule {}
