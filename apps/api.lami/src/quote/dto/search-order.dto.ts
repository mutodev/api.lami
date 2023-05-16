import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class SearchQuoteDto {

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    startDate: string;
  
    @IsString()
    @IsNotEmpty()
    @IsDateString()
    endDate: string;
  
  }
  