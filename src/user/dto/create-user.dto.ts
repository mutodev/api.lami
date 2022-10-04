import { ApiProperty } from '@nestjs/swagger';
import { EnumRoles } from '@prisma/client';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsMongoId,
  IsOptional,
  IsBoolean
} from 'class-validator';

export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phone?: string;

    // @ApiProperty()
    // @IsOptional()
    // @IsString()
    // photo?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    role: EnumRoles;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
}
