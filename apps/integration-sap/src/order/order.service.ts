import { Injectable } from '@nestjs/common';
import { ApiHttp } from '../commons/api-http.service';
import { EnumApis } from '../commons/enum-apis';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {


  constructor(private apiHttp: ApiHttp) { }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const { ...order } = createOrderDto;
      console.log('json order', JSON.stringify(createOrderDto))
      const result = await this.apiHttp.post<any>(EnumApis.ORDER, { ...order });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const result = await this.apiHttp.get<any>(`${EnumApis.ORDER}?$select=*`);
    return result;
  }

  async findOne(orderCode: string) {
    try {
      const result = await this.apiHttp.get<any>(`${EnumApis.ORDER}(${orderCode})?$select=*`);
      // console.log({result})
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async update(orderCode: string, updateOrderDto: UpdateOrderDto) {
    try {
      const result = await this.apiHttp.patch<any>(`${EnumApis.ORDER}(${orderCode})`, { ...updateOrderDto });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async remove(orderCode: string) {
    const result = await this.apiHttp.delete<any>(`${EnumApis.ORDER}('${orderCode}')`);
    return result;
  }

  async getDistributionRules() {
    const result = await this.apiHttp.get<any>('DistributionRules');
    return result;
  }

  async getOrdersAndCreditNotes(startDate: string, endDate: string) {
    try {
      let hasItems = true;
      let result: any;
      let sales: any[] = [];
      let creditNotes: any[] = [];
      while (hasItems) {
        try {
          if (!result) {
            result = await this.apiHttp.get<any>(`/$crossjoin(Invoices,Invoices/DocumentLines)?$expand=Invoices($select=DocEntry,DocNum,DocNum,DocDate,CardCode,CardName,DocTotal,VatSum,Cancelled,DocumentStatus,Series,SalesPersonCode),Invoices/DocumentLines($select=ItemCode,ItemDescription,LineNum,Quantity)&$filter=Invoices/DocEntry eq Invoices/DocumentLines/DocEntry and Invoices/SalesPersonCode eq 62 and (Invoices/DocDate ge '${startDate}') and (Invoices/DocDate le '${endDate}')`);
          } else {
            if (result.data["odata.nextLink"]) {
              result = await this.apiHttp.get<any>(`/${result.data["odata.nextLink"]}`);
            } else {
              hasItems = false;
              break;
            }
          }

          if (result?.data && result?.data?.value && result?.data?.value?.length > 0) {
            result.data.value.map(async (item) => {
              const obj = sales.find((ord) => ord.docNum == item.DocNum);
              let itemLines = item["Invoices/DocumentLines"];
              if (!obj) {                
                sales.push({
                  identification: item.CardCode,
                  name: item.CardName,
                  docDate: item.DocDate,
                  docEntry: item.DocEntry,
                  docNum: item.DocNum,
                  docTotal: item.DocTotal,
                  documentStatus: item.DocumentStatus,
                  salesPersonCode: item.SalesPersonCode,
                  serie: item.Series,
                  vatSum: item.VatSum,
                  detail: itemLines ? [{
                    itemCode: itemLines.ItemCode,
                    description: itemLines.ItemDescription,
                    lineNum: itemLines.LineNum,
                    amount: itemLines.Quantity
                  }] : []
                });
              } else {
                if (itemLines)
                  obj.detail.push({
                    itemCode: itemLines.ItemCode,
                    description: itemLines.ItemDescription,
                    lineNum: itemLines.LineNum,
                    amount: itemLines.Quantity
                  });
              }
            });
          }
          
          //https://lami-hbt.heinsohncloud.com.co:50000/b1s/v1/CreditNotes?$select=DocNum,DocDate,CardCode,CardName,DocTotal,VatSum,Cancelled,DocumentStatus,Series,SalesPersonCode&$filter=DocDate ge '2021-12-03' and DocDate le '2023-04-14' and SalesPersonCode eq 62 &$orderby=DocEntry

        } catch (error) {
          console.log('error task items', error);
        }
      }

      hasItems = true;
      while (hasItems) {
        try {
          if (!result) {
            result = await this.apiHttp.get<any>(`/CreditNotes?$select=DocNum,DocDate,CardCode,CardName,DocTotal,VatSum,Cancelled,DocumentStatus,Series,SalesPersonCode&$filter=DocDate ge '${startDate}' and DocDate le '${endDate}' and SalesPersonCode eq 62 &$orderby=DocEntry`);
          } else {
            if (result.data["odata.nextLink"]) {
              result = await this.apiHttp.get<any>(`/${result.data["odata.nextLink"]}`);
            } else {
              hasItems = false;
              break;
            }
          }

          if (result?.data && result?.data?.value && result?.data?.value?.length > 0) {
            creditNotes.push(...result?.data?.value);
          }
          
          //https://lami-hbt.heinsohncloud.com.co:50000/b1s/v1/CreditNotes?$select=DocNum,DocDate,CardCode,CardName,DocTotal,VatSum,Cancelled,DocumentStatus,Series,SalesPersonCode&$filter=DocDate ge '2021-12-03' and DocDate le '2023-04-14' and SalesPersonCode eq 62 &$orderby=DocEntry

        } catch (error) {
          console.log('error task items', error);
        }
      }

      return {sales, creditNotes};
    } catch (error) {
      throw error;
    }
  }

  async getOpenOrders(startDate: string, endDate: string) {
    try {
      let hasItems = true;
      let result: any;
      let openOrders: any[] = [];
      while (hasItems) {
        try {
          if (!result) {
            result = await this.apiHttp.get<any>(`/$crossjoin(Orders,Orders/DocumentLines)?$expand=Orders($select=DocEntry,DocNum,DocDate,CardCode,CardName,DocTotal,VatSum,Cancelled,DocumentStatus,Series,SalesPersonCode),Orders/DocumentLines($select=ItemCode,ItemDescription,LineNum,Quantity)&$filter=Orders/DocEntry eq Orders/DocumentLines/DocEntry and Orders/SalesPersonCode eq 62 and Orders/DocumentStatus eq 'bost_Open'and (Orders/DocDate ge '${startDate}') and (Orders/DocDate le '${endDate}')`);
          } else {
            if (result.data["odata.nextLink"]) {
              result = await this.apiHttp.get<any>(`/${result.data["odata.nextLink"]}`);
            } else {
              hasItems = false;
              break;
            }
          }

          if (result?.data && result?.data?.value && result?.data?.value?.length > 0) {
            result.data.value.map(async (item) => {
              const obj = openOrders.find((ord) => ord.docNum == item.DocNum);
              let itemLines = item["Orders/DocumentLines"];
              if (!obj) {                
                openOrders.push({
                  identification: item.CardCode,
                  name: item.CardName,
                  docDate: item.DocDate,
                  docEntry: item.DocEntry,
                  docNum: item.DocNum,
                  docTotal: item.DocTotal,
                  documentStatus: item.DocumentStatus,
                  salesPersonCode: item.SalesPersonCode,
                  serie: item.Series,
                  vatSum: item.VatSum,
                  detail: itemLines ? [{
                    itemCode: itemLines.ItemCode,
                    description: itemLines.ItemDescription,
                    lineNum: itemLines.LineNum,
                    amount: itemLines.Quantity
                  }] : []
                });
              } else {
                if (itemLines)
                  obj.detail.push({
                    itemCode: itemLines.ItemCode,
                    description: itemLines.ItemDescription,
                    lineNum: itemLines.LineNum,
                    amount: itemLines.Quantity
                  });
              }
            });
          }
          
        } catch (error) {
          console.log('error task items', error);
        }
      }

      return {openOrders};
    } catch (error) {
      throw error;
    }
  }

}
