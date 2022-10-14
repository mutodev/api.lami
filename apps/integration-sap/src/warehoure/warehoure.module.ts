import { Module } from '@nestjs/common';
import { WarehoureService } from './warehoure.service';
import { WarehoureController } from './warehoure.controller';
import { CommonsModule } from '../commons/commons.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CommonsModule,
    AuthModule
  ],
  controllers: [WarehoureController],
  providers: [WarehoureService]
})
export class WarehoureModule {}
