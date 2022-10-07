/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { PaginationService } from './services/pagination/pagination.service';
import { PrismaService } from './services/prisma.service';

@Module({
    imports: [
        // PassportModule,
        EasyconfigModule.register({ path: './.env' }),
       
    ],
    controllers: [],
    providers: [PrismaService, PaginationService],
    // providers: [PrismaService],
    exports: [PrismaService, PaginationService],
})
export class CommonsModule {}
