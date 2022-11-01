import { Injectable } from '@nestjs/common';
import { ApiHttp } from '../commons/api-http.service';
import { EnumApis } from '../commons/enum-apis';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  

  constructor(private apiHttp: ApiHttp) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const {...order} = createOrderDto;
      console.log('json order', JSON.stringify(createOrderDto))
      const result = await this.apiHttp.post<any>(EnumApis.ORDER, {...order });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const result = await this.apiHttp.get<any>(`${EnumApis.ORDER}?$select=CardCode,CardName,Address,Phone1,MailAddress`);
    return result;
  }

  async findOne(cardCode: string) {
    try {
      const result = await this.apiHttp.get<any>(`${EnumApis.ORDER}('${cardCode}')?$select=CardCode,CardName,Address,Phone1,MailAddress,BPAddresses`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(cardCode: string, updateOrderDto: UpdateOrderDto) {
    try {      
      const result = await this.apiHttp.patch<any>(`${EnumApis.ORDER}('${cardCode}')`, {...updateOrderDto});
      return result;
    } catch (error) {
      throw error;
    }
  }

  async remove(cardCode: string) {
    const result = await this.apiHttp.delete<any>(`${EnumApis.ORDER}('${cardCode}')`);
    return result;
  }
  
}
