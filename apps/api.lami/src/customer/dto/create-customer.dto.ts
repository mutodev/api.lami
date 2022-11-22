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
    ValidateIf,
    MaxLength
} from 'class-validator';

export class CreateCustomerDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    typeId: string;

    @ApiProperty()
    @IsNotEmpty({message: 'El tipo de identificación es requerido.'})
    @IsString()
    identificationTypeId: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255, {message: 'La cantidad de caracteres maximos permitodos son 255.'})
    @ValidateIf((item) => item.typeId === '87345bcb-46c0-11ed-88f1-7b765a5d50e1')
    @IsNotEmpty({message: 'En nombre es requerido.'})
    name: string;

    @ApiProperty()
    @IsNotEmpty({message: 'El número de identificación es requerido.'})
    @IsString()
    identification: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    source: string;

    @ApiProperty()
    @IsNotEmpty({message: 'El correo es requerido.'})
    @IsString()
    @MaxLength(255, {message: 'La cantidad de caracteres maximos permitodos son 100.'})
    email: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255, {message: 'La cantidad de caracteres maximos permitodos en el nombre son 255.'})
    @ValidateIf((item) => item.typeId === '87345bca-46c0-11ed-88f1-7b765a5d50e1')
    @IsNotEmpty({message: 'El nombre es requerido.'})
    firstName: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255, {message: 'La cantidad de caracteres maximos permitodos en el primer apellido son 255.'})
    @ValidateIf((item) => item.typeId === '87345bca-46c0-11ed-88f1-7b765a5d50e1')
    @IsNotEmpty({message: 'El apellido es requerido.'})
    lastName: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255, {message: 'La cantidad de caracteres maximos permitodos en el segundo apellido son 255.'})
    @ValidateIf((item) => item.typeId === '87345bca-46c0-11ed-88f1-7b765a5d50e1')
    @IsNotEmpty({message: 'El segundo apellido es requerido.'})
    lastName2: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(30, {message: 'La cantidad de caracteres maximos permitodos en el telefón son 30.'})
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
    @IsNotEmpty({message: 'El Municipio medios magnetico es requerido.'})
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
    @MaxLength(255, {message: 'La cantidad de caracteres maximos permitodos en el nombre para facturación son 255.'})
    @ValidateIf((item) => item.source === 'C')
    @IsNotEmpty({message: 'El nombre para facturación es requerido.'})
    firstNameBilling?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255, {message: 'La cantidad de caracteres maximos permitodos en el aplleido para facturación son 255.'})
    @ValidateIf((item) => item.source === 'C')
    @IsNotEmpty({message: 'El apellido para facturación es requerido.'})
    lastNameBilling?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255, {message: 'La cantidad de caracteres maximos permitodos en el segundo apellido para facturación son 255.'})
    @ValidateIf((item) => item.source === 'C')
    @IsNotEmpty({message: 'El segundo apellido para facturación es requerido.'})
    lastName2Billing?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    project?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    checkSameInfo?: boolean;
}
