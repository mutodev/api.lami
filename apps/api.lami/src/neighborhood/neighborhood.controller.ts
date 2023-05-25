import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, HttpStatus, HttpCode } from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../commons/guards';
import { successResponse } from '../commons/functions';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('NEIGHBORHOOD')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('neighborhood')
export class NeighborhoodController {
  constructor(private readonly neighborhoodService: NeighborhoodService) {}

  @Post()
  async create(@Request() req: Request, @Body() createNeighborhoodDto: CreateNeighborhoodDto) {
    const result = await this.neighborhoodService.create(createNeighborhoodDto);
    return successResponse('Registro guardado satisfactoriamente.', result);
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 3145728 } }))
  async importNeigborhoood(@Request() req: Request, @UploadedFile() file: Express.Multer.File,) {
    await this.neighborhoodService.importNeigborhoood(file.buffer);
    return successResponse('Los barrios fueron importados satisfactoriamente.', null);
  }

  @Get()
  async findAll(@Request() req: Request) {
    const result = await this.neighborhoodService.findAll({
      page: req['query'].page, 
      perPage: req['query'].perPage,
      where: {name: {contains: req['query'].search || '', mode: 'insensitive'}}});
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Request() req: Request, @Param('id') id: string) {
    const result = await this.neighborhoodService.findOne({id});
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNeighborhoodDto: UpdateNeighborhoodDto) {
    const result = await this.neighborhoodService.update({where: {id}, data: updateNeighborhoodDto});
    return successResponse('Registro actualizado satisfactoriamente.', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.neighborhoodService.remove({id});
    return successResponse('El barrio se ha eliminado satisfactoriamente.', result);
  }

  @Get('find-by-city-and-state/:state/:city')
  async findByCityAndState(@Param('state') state: string, @Param('city') city: string, @Request() req: Request, @Param('id') id: string) {
    const result = await this.neighborhoodService.findByCityAndState(state, city);
    return successResponse('', result);
  }

}
