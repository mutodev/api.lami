import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlphanumeric,
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsMongoId,
    IsOptional,
    IsBoolean,
    Validate,
    ValidateIf
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
    name: string;

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
    @IsString()
    @ValidateIf((item) => item.source === 'C')
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @ValidateIf((item) => item.source === 'C')
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsString()
    @ValidateIf((item) => item.source === 'C')
    @IsNotEmpty()
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
    @IsString()
    @ValidateIf((item) => item.source === 'C')
    @IsNotEmpty()
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

    @ApiProperty()
    @IsString()
    @ValidateIf((item) => item.source === 'C')
    @IsNotEmpty()
    AddressName?: string;

}
