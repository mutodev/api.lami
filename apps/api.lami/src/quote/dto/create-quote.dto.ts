import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumber,
    IsArray,
    IsDateString,
    IsDate
} from 'class-validator';


export class QuoteDetail {

    @ApiProperty()
    @IsNotEmpty({message: 'El item es requerido.'})
    @IsString()
    itemCode: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    aditionalInfo: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    discount?: number

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    value: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    vat?: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    wareHouseCode?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    arTaxCode?: string;
}

export class CreateQuoteDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'El cliente es requerido.'})
    customerId: string;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty({message: 'La fecha es requerida.'})
    date: Date;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    dueDate?: Date;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    vatTotal?: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    subTotal: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({message: 'El total es requerido.'})
    total: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    discount?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    comments?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    serie?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    salesPersonCode?: string;

    @ApiProperty({ type: QuoteDetail, isArray: true })
    @IsArray()
    @Type(() => QuoteDetail)
    quoteDetails: QuoteDetail[]

    @ApiProperty()
    @IsDate()
    @IsOptional()
    estimatedDate?: Date;
}
