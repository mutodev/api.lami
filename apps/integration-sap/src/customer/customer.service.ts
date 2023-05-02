import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';
import { ApiHttp } from '../commons/api-http.service';
import { EnumApis } from '../commons/enum-apis';
import { EnumCustomerType } from '../commons/enum-customer-type';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {

  constructor(private apiHttp: ApiHttp,
              @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy,
              private authService: AuthService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const {BPAddresses, ...customer} = createCustomerDto;
      console.log('json customer', JSON.stringify(createCustomerDto))
      const result = await this.apiHttp.post<any>(EnumApis.CUSTOMER, {...customer, BPAddresses: BPAddresses});
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll(dato: string, skip: number) {
    const result = await this.apiHttp.get<any>(`${EnumApis.CUSTOMER}?$filter=contains(CardCode,'${dato}') or contains(CardName,'${dato}')&$select=CardCode,CardName,Address,Phone1,MailAddress&$skip=${skip}`);
    return result.data;
  }

  async findOne(cardCode: string) {
    try {
      const result = await this.apiHttp.get<any>(`${EnumApis.CUSTOMER}('${cardCode}')?$select=*`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(cardCode: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      // const {CardCode,CardName,Address,Phone1,MailAddress} = updateCustomerDto;
      const {BPAddresses, ...customer} = updateCustomerDto;
      const result = await this.apiHttp.patch<any>(`${EnumApis.CUSTOMER}('${cardCode}')`, {...customer });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async remove(cardCode: string) {
    const result = await this.apiHttp.delete<any>(`${EnumApis.CUSTOMER}('${cardCode}')`);
    return result;
  }

  async findAllSelect(dato: string, skip: number) {
    const result = await this.apiHttp.get<any>(`${EnumApis.CUSTOMER}?$filter=contains(CardCode,'${dato}') or contains(CardName,'${dato}')&$select=CardCode,CardName,Phone1,Address&$skip=${skip}`);
    return result.data;
  }


  async migrateCustomers() {
    try {

        await this.authService.login();
        let hasItems = true;
        let result: any;
        while (hasItems) {
            try {
                if (!result) {
                    result = await this.apiHttp.get<any>(`${EnumApis.CUSTOMER}?$filter=CardType eq 'cLid' or CardType eq 'cCustomer'&$select=CardCode,BPAddresses,CardName,EmailAddress,CardType,Phone1,Phone2,U_HBT_RegTrib,GroupCode,PayTermsGrpCode,SalesPersonCode,U_HBT_Nacional,U_HBT_RegFis,U_HBT_MedPag,U_HBT_Nombres,U_HBT_Apellido1,U_HBT_Apellido2,U_HBT_ActEco`);
                } else {
                    if (result?.data && result?.data["odata.nextLink"]) {
                        result = await this.apiHttp.get<any>(`/${result.data["odata.nextLink"]}`);
                    } else {
                        hasItems = false;
                        break;
                    }
                }
                console.log({ result });
                if (result?.data && result?.data?.value && result?.data?.value?.length > 0)
                    await Promise.all(result.data.value.map(async (cus) => {
                        console.log('cus', cus.CardName)
                        const names = cus.CardName.split(' ');
                        const firstName = names[0];
                        const lastName = names[1] || '';
                        const lastName2 = names[2] || '';
                        const address1 = cus.BPAddresses[0];
                        const address2 = cus.BPAddresses[1];
                        await this.clientProxi.emit('customer/create-from-sap',{
                          typeId: EnumCustomerType.PersonaNatural,
                          identificationTypeId: '7974094a-46c0-11ed-88f1-7b765a5d50e1',
                          AddressName: 'GENERAL',
                          name: cus.CardName,   
                          identification: cus.CardCode,    
                          email: cus.EmailAddress || '',
                          firstName: firstName,
                          lastName: lastName,
                          lastName2: lastName2,
                          source: cus.CardType == 'cCustomer' ? 'C' : 'L',
                          address: '',
                          address2: '',
                          phone: cus.Phone1,
                          phone2: cus.Phone2,
                          U_HBT_RegTrib: cus.U_HBT_RegTrib,
                          groupCode: cus.GroupCode?.toString(),
                          payTermsGrpCode: cus.PayTermsGrpCode?.toString(),   
                          salesPersonCode: cus.SalesPersonCode?.toString(),     
                          U_HBT_Nacional: cus.U_HBT_Nacional,
                          U_HBT_RegFis: cus.U_HBT_RegFis,
                          U_HBT_MedPag: cus.U_HBT_MedPag,
                          firstNameBilling: cus.U_HBT_Nombres,
                          lastNameBilling: cus.U_HBT_Apellido1,
                          lastName2Billing: cus.U_HBT_Apellido2,
                          project: '0011',
                          checkSameInfo: false,
                          City: address1?.City,
                          County: address1?.County,
                          addressBilling: address1?.Street,
                          CityBilling: address2?.address2,
                          CountyBilling: address2?.County,
                          checkSameAddress: false,
                          U_HBT_ActEco: cus?.U_HBT_ActEco,
                          neighborhoodName: '',
                          neighborhoodNameBilling: '',
                          userId: 'db87b1f4-5daa-4a51-95b8-173385a90491', // cvisbal
                          sendToSap: true
                        })
                    }));                    
            } catch (error) {
                throw error;
            }
        }
        return 'Migrado.';
    } catch (error) {
        throw error;
        // console.log('migrateItems', error)
    }
}
  
}
