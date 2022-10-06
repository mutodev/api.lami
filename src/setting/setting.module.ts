import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { CommonsModule } from 'src/commons/commons.module';

@Module({
  imports: [CommonsModule],
  controllers: [SettingController],
  providers: [SettingService]
})
export class SettingModule {}
