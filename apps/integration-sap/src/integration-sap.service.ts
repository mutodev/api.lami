import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { ApiHttp } from './commons/api-http.service';
import { EnumApis } from './commons/enum-apis';
import { convertCity } from './commons/functions';
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
    let data =  [{ name: 'CLCONTADOBAQ', cities: ['Barranquilla'] },
    { name: 'CLCONTADOVALLE', cities: ['Valledupar'] },
    { name: 'CLCONTADOCART', cities: ['Cartagena'] },
    { name: 'CLBRILLABAQ', cities: ['Barranquilla'] },
    { name: 'CLBRILLAVALLE', cities: ['Valledupar'] },
    { name: 'CLBRILLACART', cities: ['Cartagena'] },
    { name: 'CLCREDITOBOGOTA', cities: ['Barranquilla', 'Cartagena', 'Valledupar'] },
    { name: 'CLBRILLASAN', cities: [] },
    { name: 'CLPROVEEDORES', cities: ['Barranquilla'] },
    { name: 'CLSERVICREDITOS', cities: [] },
    { name: 'CLLISTOPAGO', cities: [] },
    { name: 'CLCREDGERENCIA', cities: ['Barranquilla', 'Cartagena', 'Valledupar'] }];
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
        if (item.Type === 'bbpgt_CustomerGroup') {
          const obj = data.find((a) => a.name.toLowerCase() === item.Name.toLowerCase());
          await this.prismaService.settingDetail.create({
            data: {
              name: item.Name,
              code: item.Code + "",
              settingId: setting.id,
              extendedData: {cities: obj.cities},
              active: !!obj
            }
          });
        }
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
    const data =  [
      { name: 'Brilla Barranquilla', cities: ['Barranquilla'], codes: {factorCode: 'BAQ', factorCode2: 'BRILLA'} },
      { name: 'Brilla Cartagena', cities: ['Cartagena'], codes: {factorCode: 'CAR', factorCode2: 'BRILLA'} },
      { name: 'Brilla Valledupar', cities: ['Valledupar'], codes: {factorCode: 'VAL', factorCode2: 'BRILLA'} },
      { name: 'Contado Barranquilla', cities: ['Barranquilla'], codes: {factorCode: 'BAQ', factorCode2: 'CONTADO'} },
      { name: 'Contado Cartagena', cities: ['Cartagena'], codes: {factorCode: 'CAR', factorCode2: 'CONTADO'} },
      { name: 'Contado Valledupar', cities: ['Valledupar'], codes: {factorCode: 'VAL', factorCode2: 'CONTADO'} },
      { name: 'Contraentrega Barranquilla', cities: ['Barranquilla'], codes: {factorCode: 'BAQ', factorCode2: 'CONTADO'} },
      { name: 'Contraentrega Cartagena', cities: ['Cartagena'], codes: {factorCode: 'CAR', factorCode2: 'CONTADO'} },
      { name: 'Contraentrega Valledupar', cities: ['Valledupar'], codes: {factorCode: 'VAL', factorCode2: 'CONTADO'} },
      { name: 'Obsequio', cities: ['Barranquilla'], codes: {factorCode: 'BAQ', factorCode2: ''} },
      { name: 'Obsequio', cities: ['Cartagena' ], codes: {factorCode: 'CAR', factorCode2: ''} },
      { name: 'Obsequio', cities: ['Valledupar' ], codes: {factorCode: 'VAL', factorCode2: ''} },
      { name: 'Plan Separe Barranquilla', cities: ['Barranquilla'], codes: {factorCode: 'BAQ', factorCode2: 'CREDITO'} },
      { name: 'Plan Separe Cartagena', cities: ['Cartagena'], codes: {factorCode: 'CAR', factorCode2: 'CREDITO'} },
      { name: 'Plan Separe Valledupar', cities: ['Valledupar'], codes: {factorCode: 'VAL', factorCode2: 'CREDITO'} },
      { name: 'CREDITOS A EMPLEADOS', cities: ['Barranquilla'], codes: {factorCode: 'BAQ', factorCode2: 'CREDITO'} },
      { name: 'CREDITOS A EMPLEADOS', cities: ['Cartagena'], codes: {factorCode: 'CAR', factorCode2: 'CREDITO'} },
      { name: 'CREDITOS A EMPLEADOS', cities: ['Valledupar'], codes: {factorCode: 'VAL', factorCode2: 'CREDITO'} }
    ];
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
          const list = data.filter((a) => a.name.toLowerCase() === item.PaymentTermsGroupName.toLowerCase());
          if (list.length > 0) {
            Promise.all(list.map(async (obj) => {
              await this.prismaService.settingDetail.create({
                data: {
                  name: item.PaymentTermsGroupName,
                  code: item.GroupNumber + "",
                  settingId: setting.id,
                  extendedData: {cities: obj.cities, codes: obj.codes}
                }
              });
            }));
          }
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
        result = await this.getData(`/SalesPersons?$filter=Active eq 'tYES'`);
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
       let city = convertCity(item.Remarks);
        await this.prismaService.settingDetail.create({
          data: {
            name: item.SalesEmployeeName,
            code: item.SalesEmployeeCode + "",
            settingId: setting.id,
            extendedData: {
              cities: city ? [city] : []
            }
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
        result = await this.getData(`${EnumApis.ITEM}?$filter=SalesItem eq 'tYES' and Valid eq 'tYES'&$select=ItemCode,ItemName,QuantityOnStock,QuantityOrderedFromVendors,QuantityOrderedByCustomers,ItemPrices,ItemWarehouseInfoCollection,SalesItem,Valid,ArTaxCode`);
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
            try {
              let price = item.ItemPrices.find((a) => a.PriceList == 1);
              await this.prismaService.items.create({
                data: {
                  name: item.ItemName,
                  code: item.ItemCode,
                  price: price ? price.Price : 0,
                  quantityOnStock: item.QuantityOnStock,
                  quantityOrderedFromVendors: item.QuantityOrderedFromVendors,
                  quantityOrderedByCustomers: item.QuantityOrderedByCustomers,
                  arTaxCode: item.ArTaxCode,
                  itemsWareHouses: {
                    create: item.ItemWarehouseInfoCollection.map((w) => {
                      const { WarehouseCode, InStock, ItemCode, Ordered, Committed} = w;
                      let wareHouse = wareHouses.find((a) => a.WarehouseCode == w.WarehouseCode);
                      return {
                        warehouseCode: WarehouseCode,
                        warehouseName: wareHouse.WarehouseName,
                        inStock: InStock,
                        itemCode: ItemCode,
                        committed: Committed,
                        ordered: Ordered
                      }
                    })
                  }
                }
              });
            } catch (error) {
              console.error({error});
            }           
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
    let projects =   [
      { code:"0011", name: "Retail TV-Radio", field: 'retail'} ,
      { code:"0012", name: "Retail Tienda", field: 'retail'} ,
      { code:"0013", name: "Retail Referido", field: 'retail'} ,
      { code:"0014", name: "Retail Volanteo", field: 'retail'} ,
      { code:"0015", name: "Retail Aliados", field: 'retail'} ,
      { code:"0021", name: "Digital Instagram", field: 'digital'} ,
      { code:"0022", name: "Digital Facebook", field: 'digital'} ,
      { code:"0023", name: "Digital Google", field: 'digital'}
    ];
    let sapProjects = result.data.value;
    await Promise.all(projects.map(async (item) => {
      const proj = sapProjects.find((a) => a.Name.toLowerCase().includes(item.field));
      await this.prismaService.settingDetail.create({
        data: {
          name: item.name,
          code: item.code,
          settingId: setting.id,
          value: proj.Code
        }
      })
    }));
    return 'Migrado';
  }

  async migrateSeries() {
    await this.authService.login();
    let hasItems = true;
    let result: any;
    await this.prismaService.setting.deleteMany({ where: { name: 'SERIES' } });
    const setting = await this.prismaService.setting.create({
      data: { name: 'SERIES' }
    });
   
    while (hasItems) {
      if (!result) {
        result = await this.getData(`/$metadata#Collection(SAPB1.Series)`);
      } else {
        if (result.data["odata.nextLink"]) {
          result = await this.getData(`/${result.data["odata.nextLink"]}`);
        } else {
          hasItems = false;
          break;
        }
      }
      
      await Promise.all(result.data.value.map(async (item) => {       
        const city = item.Remarks.toLowerCase().includes('barranquilla') ? 'Barranquilla' : item.Remarks.toLowerCase().includes('valledupar') ? 'Valledupar' : item.Remarks.toLowerCase().includes('cartagena') ? 'Cartagena' : item.Remarks.toLowerCase();
        await this.prismaService.settingDetail.create({
          data: {
            name: item.Name,
            code: item.Series + "",
            settingId: setting.id,
            extendedData: {cities: [city]},
            active: true
          }
        });        
      }));
    }
    return 'Migrado';
  }

}
