import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class SearchItemDto {

    @ApiProperty()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    stop: number;

}
