import { Injectable } from '@nestjs/common';
import { ApiHttp } from '../commons/api-http.service';
import { EnumApis } from '../commons/enum-apis';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private apiHttp: ApiHttp) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const result = await this.apiHttp.post<any>(EnumApis.ITEM, createProductDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const result = await this.apiHttp.get<any>(`${EnumApis.ITEM}?$select=*`);
    return result;
  }

  async findOne(itemCode: string) {
    try {
      const result = await this.apiHttp.get<any>(`${EnumApis.ITEM}('${itemCode}')?$select=*`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(itemCode: string, updateProductDto: UpdateProductDto) {
    try {
      const result = await this.apiHttp.patch<any>(`${EnumApis.ITEM}('${itemCode}')`, updateProductDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async remove(itemCode: string) {
    const result = await this.apiHttp.delete<any>(`${EnumApis.ITEM}('${itemCode}')`);
    return result;
  }
}
