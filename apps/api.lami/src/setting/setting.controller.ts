import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../commons/guards';
import { successResponse } from '../commons/functions';

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
  async findOne(@Req() req, @Param('name') name: string) {
    console.log(req.user)
    const result = await this.settingService.findOne({name}, req.user?.salesPersonCode);
    return successResponse('', result);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update({where: {id}, data: {...updateSettingDto}});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove({id});
  }

  @Get('all/details/sales/personcode')
  async findSalesPersonCode() {
    const result = await this.settingService.findSalesPersonCode();
    return successResponse('', result);
  }

  @Get('all/details/:name')
  async findAllDetails(@Req() req, @Param('name') name: string) {
    const result = await this.settingService.findAllDetails({name}, req.user?.salesPersonCode);
    return successResponse('', result);
  }

  @Get('all/details/by-city/:name/:salesperson')
  async findAllDetailsByCity(@Req() req, @Param('name') name: string, @Param('salesperson') salesperson: string) {
    const result = await this.settingService.findAllDetails({name}, salesperson);
    return successResponse('', result);
  }  

  @Get('get-sales-person/from-sap/')
  async getSalesPersonFromSap(@Req() req, @Param('city') city: string) {
    const result = await this.settingService.getSalesPersonFromSap(city);
    return successResponse('', result);
  }

  @Get('get-sales-person/from-sap/:city')
  async getAllSalesPersonFromSap(@Req() req, @Param('city') city: string) {
    const result = await this.settingService.getSalesPersonFromSap(city);
    return successResponse('', result);
  }

  @Post('migrate-sales-person')
  async migrateSalesPerson() {
    const result = await this.settingService.migrateSalesPerson();
    return successResponse(result, null);
  }

}
