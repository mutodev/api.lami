import { Global, Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { CommonsModule } from '../commons/commons.module';

@Global()
@Module({
  imports: [
    CommonsModule
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService]
})
export class ItemsModule {}
