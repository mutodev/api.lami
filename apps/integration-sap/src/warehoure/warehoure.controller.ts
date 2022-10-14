import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WarehoureService } from './warehoure.service';
import { CreateWarehoureDto } from './dto/create-warehoure.dto';
import { UpdateWarehoureDto } from './dto/update-warehoure.dto';

@Controller('warehoure')
export class WarehoureController {
  constructor(private readonly warehoureService: WarehoureService) {}

  @Post()
  create(@Body() createWarehoureDto: CreateWarehoureDto) {
    return this.warehoureService.create(createWarehoureDto);
  }

  @Get()
  findAll() {
    return this.warehoureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehoureService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehoureDto: UpdateWarehoureDto) {
    return this.warehoureService.update(id, updateWarehoureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehoureService.remove(id);
  }
}
