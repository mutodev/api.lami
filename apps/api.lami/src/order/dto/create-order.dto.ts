import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumber,
    IsArray
} from 'class-validator';

export class CreateOrderDto {

    @IsString()
    @IsNotEmpty()
    customerId: string;

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsNumber()
    @IsNotEmpty()
    vatTotal: number;

    @IsNumber()
    @IsNotEmpty()
    subTotal: number;

    @IsNumber()
    @IsNotEmpty()
    total: number;

    @IsArray()
    orderDetails: OrderDetail[]
}

export class OrderDetail {

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    aditionalInfo: string;

    @IsOptional()
    @IsNumber()
    discount?: number

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumber()
    value: number;

    @IsOptional()
    @IsNumber()
    vat?: number;

    @IsNotEmpty()
    @IsString()
    project: string;
}
