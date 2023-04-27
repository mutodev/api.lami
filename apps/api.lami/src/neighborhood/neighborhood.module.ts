import { Module } from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodController } from './neighborhood.controller';
import { CommonsModule } from '../commons/commons.module';

@Module({
  imports: [CommonsModule],
  controllers: [NeighborhoodController],
  providers: [NeighborhoodService],
  exports: [NeighborhoodService]
})
export class NeighborhoodModule {}
