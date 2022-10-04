/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EasyconfigModule, EasyconfigService } from 'nestjs-easyconfig';
import { PrismaService } from './services/prisma.service';

@Module({
    imports: [
        // PassportModule,
        EasyconfigModule.register({ path: './.env' }),
       
    ],
    controllers: [],
    providers: [PrismaService],
    // providers: [PrismaService],
    exports: [PrismaService],
})
export class CommonsModule {}
