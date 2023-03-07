import { PartialType } from '@nestjs/swagger';
import { CreatePqrDto } from './create-pqr.dto';

export class UpdatePqrDto extends PartialType(CreatePqrDto) {}
