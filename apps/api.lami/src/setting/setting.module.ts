import { Global, Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { CommonsModule } from './../commons/commons.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    CommonsModule,
    ClientsModule.register([
      {
        name: 'CLIENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
          retryAttempts: 3,
          retryDelay: 1000
        }
      }
    ])
  ],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService]
})
export class SettingModule {}
