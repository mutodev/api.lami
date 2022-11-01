import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateItemDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    quantityOnStock: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    quantityOrderedFromVendors: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    quantityOrderedByCustomers: number;
}
