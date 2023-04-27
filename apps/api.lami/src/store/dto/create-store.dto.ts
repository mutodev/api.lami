import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStoreDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    city?: string;

}
