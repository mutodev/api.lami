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
    @IsString()
    @ValidateIf((item) => item.typeId === '87345bcb-46c0-11ed-88f1-7b765a5d50e1')
    @IsNotEmpty()
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
    email?: string;

    @ApiProperty()
    @IsString()
    @ValidateIf((item) => item.typeId === '87345bca-46c0-11ed-88f1-7b765a5d50e1')
    @IsNotEmpty()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @ValidateIf((item) => item.typeId === '87345bca-46c0-11ed-88f1-7b765a5d50e1')
    @IsNotEmpty()
    lastName?: string;

    @ApiProperty()
    @IsString()
    @ValidateIf((item) => item.typeId === '87345bca-46c0-11ed-88f1-7b765a5d50e1')
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
    firstNameBilling?: string;

    @ApiProperty()
    @IsString()
    @ValidateIf((item) => item.source === 'C')
    @IsNotEmpty()
    lastNameBilling?: string;

    @ApiProperty()
    @IsString()
    @ValidateIf((item) => item.source === 'C')
    @IsNotEmpty()
    lastName2Billing?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    project?: string;


}
