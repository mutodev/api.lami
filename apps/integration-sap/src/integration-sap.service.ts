import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { ApiHttp } from './commons/api-http.service';
import { EnumApis } from './commons/enum-apis';
import { PrismaService } from './commons/prisma.service';

@Injectable()
export class IntegrationSapService {

  constructor(private apiHttp: ApiHttp,
    private prismaService: PrismaService,
    private authService: AuthService) { }

  async migrateGrupos() {
    await this.authService.login();
    let hasItems = true;
    let result: any;
    await this.prismaService.setting.deleteMany({ where: { name: 'CUSTOMER_GROUP' } });
    const setting = await this.prismaService.setting.create({
      data: { name: 'CUSTOMER_GROUP' }
    });
    while (hasItems) {
      if (!result) {
        result = await this.getData(`/BusinessPartnerGroups`);
      } else {
        if (result.data["odata.nextLink"]) {
          result = await this.getData(`/${result.data["odata.nextLink"]}`);
        } else {
          hasItems = false;
          break;
        }
      }
      console.log({ result });
      await Promise.all(result.data.value.map(async (item) => {
        if (item.Type === 'bbpgt_CustomerGroup')
          await this.prismaService.settingDetail.create({
            data: {
              name: item.Name,
              code: item.Code + "",
              settingId: setting.id
            }
          })
      }));
    }
    return 'Migrado';
  }

  async migratePayTermsGrpCodes() {
    await this.authService.login();
    let hasItems = true;
    let result: any;
    await this.prismaService.setting.deleteMany({ where: { name: 'PayTermsGrpCode' } });
    const setting = await this.prismaService.setting.create({
      data: { name: 'PayTermsGrpCode' }
    });
    while (hasItems) {
      if (!result) {
        result = await this.getData(`/PaymentTermsTypes`);
      } else {
        if (result.data["odata.nextLink"]) {
          await this.authService.login();
          result = await this.getData(`/${result.data["odata.nextLink"]}`);
        } else {
          hasItems = false;
          break;
        }
      }
      console.log({ result });
      if (result?.data && result?.data?.value && result?.data?.value?.length > 0)
        await Promise.all(result.data.value.map(async (item) => {
          await this.prismaService.settingDetail.create({
            data: {
              name: item.PaymentTermsGroupName,
              code: item.GroupNumber + "",
              settingId: setting.id
            }
          });
        }));
    }
    return 'Migrado';
  }

  async migrateSalesPersonCode() {
    await this.authService.login();
    let hasItems = true;
    let result: any;
    await this.prismaService.setting.deleteMany({ where: { name: 'SalesPersonCode' } });
    const setting = await this.prismaService.setting.create({
      data: { name: 'SalesPersonCode' }
    });
    while (hasItems) {
      // const result = await this.apiHttp.get<any>('/SalesPersons');
      if (!result) {
        result = await this.getData(`/SalesPersons`);
      } else {
        if (result.data["odata.nextLink"]) {
          result = await this.getData(`/${result.data["odata.nextLink"]}`);
        } else {
          hasItems = false;
          break;
        }
      }
      console.log({ result });
      await Promise.all(result.data.value.map(async (item) => {
        // if (item.Type === 'bbpgt_CustomerGroup')
        await this.prismaService.settingDetail.create({
          data: {
            name: item.SalesEmployeeName,
            code: item.SalesEmployeeCode + "",
            settingId: setting.id
          }
        })
      }));
    }
    return 'Migrado';
  }

  async getSalesPersons(url: string) {
    try {
      const result = await this.apiHttp.get<any>(url);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async migrateItems() {
    await this.authService.login();
    let hasItems = true;
    let result: any;
    await this.prismaService.items.deleteMany({});
    while (hasItems) {
      if (!result) {
        result = await this.getData(`${EnumApis.ITEM}?$filter=SalesItem eq 'tYES' and Valid eq 'tYES'&$select=ItemCode,ItemName,QuantityOnStock,QuantityOrderedFromVendors,QuantityOrderedByCustomers,ItemPrices,ItemWarehouseInfoCollection,SalesItem,Valid`);
      } else {
        if (result.data["odata.nextLink"]) {
          await this.authService.login();
          const resp = await this.getData(`/${result.data["odata.nextLink"]}`);
          if (result?.data)
            result = resp;
        } else {
          hasItems = false;
          break;
        }
      }
      const resultWareHouses = await this.apiHttp.get<any>(`${EnumApis.WAREHOUSE}`);
      const wareHouses: any[] = resultWareHouses.data.value;
      console.log({ result });
      if (result?.data && result?.data?.value && result?.data?.value?.length > 0)
        await Promise.all(result.data.value.map(async (item) => {
          if (item.SalesItem == 'tYES' && item.Valid === 'tYES') {
            let price = item.ItemPrices.find((a) => a.PriceList == 1);
            await this.prismaService.items.create({
              data: {
                name: item.ItemName,
                code: item.ItemCode,
                price: price ? price.Price : 0,
                quantityOnStock: item.QuantityOnStock,
                quantityOrderedFromVendors: item.QuantityOrderedFromVendors,
                quantityOrderedByCustomers: item.QuantityOrderedByCustomers,
                itemsWareHouses: {
                  create: item.ItemWarehouseInfoCollection.map((w) => {
                    const { WarehouseCode, InStock, ItemCode } = w;
                    let wareHouse = wareHouses.find((a) => a.WarehouseCode == w.WarehouseCode);
                    return {
                      warehouseCode: WarehouseCode,
                      warehouseName: wareHouse.WarehouseName,
                      inStock: InStock,
                      itemCode: ItemCode
                    }
                  })
                }
              }
            });
          }
        }));
    }
    return 'Migrado';
  }

  async getData(url: string) {
    try {
      const result = await this.apiHttp.get<any>(url);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async migrateProject() {
    await this.authService.login();
    const result = await this.apiHttp.get<any>('/Projects');
    await this.prismaService.setting.deleteMany({ where: { name: 'Project' } });
    const setting = await this.prismaService.setting.create({
      data: { name: 'Project' }
    });
    console.log({ result })
    await Promise.all(result.data.value.map(async (item) => {
      // if (item.Type === 'bbpgt_CustomerGroup')
      await this.prismaService.settingDetail.create({
        data: {
          name: item.Code,
          code: item.Name,
          settingId: setting.id
        }
      })
    }));
    return 'Migrado';
  }

}
