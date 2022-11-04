import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiHttp } from '../commons/api-http.service';
import { EnumApis } from '../commons/enum-apis';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private apiHttp: ApiHttp,
              private authService: AuthService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const result = await this.apiHttp.post<any>(EnumApis.ITEM, createProductDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    await this.authService.login();
    const result = await this.apiHttp.get<any>(`${EnumApis.ITEM}?$select=ItemCode,ItemName,QuantityOnStock,QuantityOrderedFromVendors,QuantityOrderedByCustomers,ItemPrices,ItemWarehouseInfoCollection,SalesItem,Valid`);
    return result;
  }

  async findOne(itemCode: string) {
    try {
      await this.authService.login();
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
