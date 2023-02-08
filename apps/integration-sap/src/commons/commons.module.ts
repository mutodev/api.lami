/*
https://docs.nestjs.com/modules
*/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiHttp } from './api-http.service';
import { PrismaService } from './prisma.service';
import * as https from 'https';
import { EasyconfigModule } from 'nestjs-easyconfig';

@Module({
    imports: [
        EasyconfigModule.register({ path: './.env' }),
        HttpModule.register({
            timeout: 50000,
            maxRedirects: 5,
            httpsAgent: new https.Agent({
              rejectUnauthorized: false
            })
          }),
    ],
    controllers: [],
    providers: [PrismaService, ApiHttp],
    exports: [PrismaService, ApiHttp]
})
export class CommonsModule {}
