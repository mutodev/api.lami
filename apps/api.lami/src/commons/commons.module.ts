/*
https://docs.nestjs.com/modules
*/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { PaginationService } from './services/pagination/pagination.service';
import { PrismaService } from './services/prisma.service';
import * as https from 'https';

@Module({
    imports: [
        // PassportModule,
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
    providers: [PrismaService, PaginationService],
    // providers: [PrismaService],
    exports: [PrismaService, PaginationService],
})
export class CommonsModule {}
