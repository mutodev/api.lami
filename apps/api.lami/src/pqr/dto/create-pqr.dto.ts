import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";


export class OrderDetailPqrs {

  @ApiProperty()
  @IsOptional()
  @IsString()
  OrderDetailId?: string;
  
}

export class CreatePqrDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  identificationTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  identification: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  descripction: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  celular: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email?: string;

  @ApiProperty({ type: OrderDetailPqrs, isArray: true })
  @IsArray()
  @Type(() => OrderDetailPqrs)
  OrderDetailPqrs: OrderDetailPqrs[];

}
