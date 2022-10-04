import { ApiProperty } from '@nestjs/swagger';
import { EnumCustomerType, EnumRoles } from '@prisma/client';
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

export class CreateCustomerDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    type: EnumCustomerType;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    identificationType: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    identification: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    source: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;

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
    address?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phone: string;

}
