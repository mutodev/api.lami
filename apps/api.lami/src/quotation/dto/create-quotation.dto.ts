import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumber,
    IsArray
} from 'class-validator';


export class QuotationDetail {

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
    @IsNotEmpty()
    @IsString()
    project: string;
}

export class CreateQuotationDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    date: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    dueDate?: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    vatTotal: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    subTotal: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    total: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    discount?: number;

    @ApiProperty({ type: QuotationDetail, isArray: true })
    @IsArray({each: true})
    orderDetails: QuotationDetail[]
}
