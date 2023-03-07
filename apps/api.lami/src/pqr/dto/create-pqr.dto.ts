import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreatePqrDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
  type 

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  documentType

  
  identification
  customerId
  title
  name
  descripction    String? @db.Text
  celular         String?
  email           String?
  customer        Customer? @relation(name: "pqrcustomer", fields: [customerId], references: [id])
  itemsPqrs       ItemsPQR[] @relation(name: "pqritems")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
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
