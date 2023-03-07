import { Module } from '@nestjs/common';
import { PqrService } from './pqr.service';
import { PqrController } from './pqr.controller';

@Module({
  controllers: [PqrController],
  providers: [PqrService]
})
export class PqrModule {}
