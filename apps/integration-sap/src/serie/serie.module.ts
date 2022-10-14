import { Module } from '@nestjs/common';
import { SerieService } from './serie.service';
import { SerieController } from './serie.controller';
import { CommonsModule } from '../commons/commons.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CommonsModule,
    AuthModule
  ],
  controllers: [SerieController],
  providers: [SerieService]
})
export class SerieModule {}
