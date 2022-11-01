import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { CommonsModule } from '../commons/commons.module';

@Module({
  imports: [
    CommonsModule
  ],
  controllers: [ItemsController],
  providers: [ItemsService]
})
export class ItemsModule {}
