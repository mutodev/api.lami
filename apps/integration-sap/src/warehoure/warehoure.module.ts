import { Global, Module } from '@nestjs/common';
import { WarehoureService } from './warehoure.service';
import { WarehoureController } from './warehoure.controller';
import { CommonsModule } from '../commons/commons.module';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    CommonsModule,
    AuthModule
  ],
  controllers: [WarehoureController],
  providers: [WarehoureService],
  exports: [WarehoureService]
})
export class WarehoureModule {}
