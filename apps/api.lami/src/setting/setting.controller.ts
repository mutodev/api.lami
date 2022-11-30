import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../commons/guards';

@ApiTags('SETTING')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('setting')
export class SettingController {

  constructor(private readonly settingService: SettingService) {}

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingService.create({...createSettingDto});
  }

  @Get()
  findAll(@Request() req) {
    return this.settingService.findAll({where: req.query.name});
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.settingService.findOne({name});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update({where: {id}, data: {...updateSettingDto}});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove({id});
  }

  @Get('sales/personcode')
  findSalesPersonCode() {
    return this.settingService.findSalesPersonCode();
  }

}
