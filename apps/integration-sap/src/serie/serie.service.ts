import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiHttp } from '../commons/api-http.service';
import { EnumApis } from '../commons/enum-apis';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';

@Injectable()
export class SerieService {
  constructor(private apiHttp: ApiHttp,
    private authService: AuthService) { }

  async create(createSerieDto: CreateSerieDto) {
    try {
      const result = await this.apiHttp.post<any>(EnumApis.SERIES, createSerieDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    await this.authService.login();
    const result = await this.apiHttp.get<any>(`${EnumApis.SERIES}`);
    return result;
  }

  async findOne(serieCode: string) {
    try {
      await this.authService.login();
      const result = await this.apiHttp.get<any>(`${EnumApis.SERIES}('${serieCode}')`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(serieCode: string, updateSerieDto: UpdateSerieDto) {
    try {
      const result = await this.apiHttp.patch<any>(`${EnumApis.SERIES}('${serieCode}')`, updateSerieDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async remove(serieCode: string) {
    const result = await this.apiHttp.delete<any>(`${EnumApis.SERIES}('${serieCode}')`);
    return result;
  }
}
