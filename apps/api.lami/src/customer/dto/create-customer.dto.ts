import { ApiProperty } from '@nestjs/swagger';
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
    typeId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    identificationTypeId: string;

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
    @IsNotEmpty()
    @IsString()
    lastName2: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    U_HBT_RegTrib?: string; 

    @ApiProperty()
    @IsOptional()
    @IsString()
    groupCode?: string; 

    @ApiProperty()
    @IsOptional()
    @IsString()
    payTermsGrpCode?: string; 

    @ApiProperty()
    @IsOptional()
    @IsString()
    salesPersonCode?: string; 

    @ApiProperty()
    @IsOptional()
    @IsString()
    U_HBT_TipDoc?: string; 

    @ApiProperty()
    @IsOptional()
    @IsString()
    U_HBT_MunMed?: string; 

    @ApiProperty()
    @IsOptional()
    @IsString()
    U_HBT_Nacional?: string; 

    @ApiProperty()
    @IsOptional()
    @IsString()
    U_HBT_RegFis?: string; 

    @ApiProperty()
    @IsOptional()
    @IsString()
    U_HBT_MedPag?: string; 

}
