import { Injectable } from '@nestjs/common';
import { ApiHttp } from '../commons/api-http.service';
import { EnumApis } from '../commons/enum-apis';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {

  constructor(private apiHttp: ApiHttp) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const {CardCode, ...customer} = createCustomerDto;
      const result = await this.apiHttp.post<any>(EnumApis.CUSTOMER, {...customer, CardType: 'L', CardCode, FederalTaxID: CardCode});
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const result = await this.apiHttp.get<any>(`${EnumApis.CUSTOMER}?$select=CardCode,CardName,Address,Phone1,MailAddress`);
    return result;
  }

  async findOne(cardCode: string) {
    try {
      const result = await this.apiHttp.get<any>(`${EnumApis.CUSTOMER}('${cardCode}')?$select=CardCode,CardName,Address,Phone1,MailAddress`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(cardCode: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const {CardCode,CardName,Address,Phone1,MailAddress} = updateCustomerDto;
      const result = await this.apiHttp.patch<any>(`${EnumApis.CUSTOMER}('${cardCode}')`, {CardName,Address,Phone1,MailAddress});
      return result;
    } catch (error) {
      throw error;
    }
  }

  async remove(cardCode: string) {
    const result = await this.apiHttp.delete<any>(`${EnumApis.CUSTOMER}('${cardCode}')`);
    return result;
  }
  
}
