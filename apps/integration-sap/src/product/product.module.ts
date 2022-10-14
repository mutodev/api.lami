import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CommonsModule } from '../commons/commons.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CommonsModule,
    AuthModule
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
