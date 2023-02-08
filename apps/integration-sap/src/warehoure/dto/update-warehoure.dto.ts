import { PartialType } from '@nestjs/swagger';
import { CreateWarehoureDto } from './create-warehoure.dto';

export class UpdateWarehoureDto extends PartialType(CreateWarehoureDto) {}
