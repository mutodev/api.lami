import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiHttp } from '../commons/api-http.service';
import { EnumApis } from '../commons/enum-apis';
import { CreateWarehoureDto } from './dto/create-warehoure.dto';
import { UpdateWarehoureDto } from './dto/update-warehoure.dto';

@Injectable()
export class WarehoureService {
  constructor(private apiHttp: ApiHttp,
    private authService: AuthService) { }

  async create(createProductDto: CreateWarehoureDto) {
    try {
      const result = await this.apiHttp.post<any>(EnumApis.WHEREHOUSE, createProductDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    await this.authService.login();
    const result = await this.apiHttp.get<any>(`${EnumApis.WHEREHOUSE}?$select=*`);
    return result;
  }

  async findOne(warehouseCode: string) {
    try {
      await this.authService.login();
      const result = await this.apiHttp.get<any>(`${EnumApis.WHEREHOUSE}('${warehouseCode}')?$select=*`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(warehouseCode: string, updateProductDto: UpdateWarehoureDto) {
    try {
      const result = await this.apiHttp.patch<any>(`${EnumApis.WHEREHOUSE}('${warehouseCode}')`, updateProductDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async remove(warehouseCode: string) {
    const result = await this.apiHttp.delete<any>(`${EnumApis.WHEREHOUSE}('${warehouseCode}')`);
    return result;
  }
}
