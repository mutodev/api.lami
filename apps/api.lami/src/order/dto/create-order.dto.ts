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


export class OrderDetail {

    @ApiProperty()
    @IsNotEmpty()
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
    @IsNotEmpty()
    @IsString()
    project: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    wareHouseCode?: string;
}

export class CreateOrderDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
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
    @IsNotEmpty()
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

    @ApiProperty({ type: OrderDetail, isArray: true })
    @IsArray()
    @Type(() => OrderDetail)
    orderDetails: OrderDetail[]
}
