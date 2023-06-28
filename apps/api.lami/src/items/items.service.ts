import { Inject, Injectable } from '@nestjs/common';
import { Items as Model, Prisma } from '@prisma/client';
import { PaginationService } from '../commons/services/pagination/pagination.service';
import { PrismaService } from '../commons/services/prisma.service';
import { calculateEstimateDate } from '../commons/functions';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiHttp } from '../commons/services/api-http.service';
import { EnumApis } from '../commons/enums/enum-apis';

@Injectable()
export class ItemsService {

  constructor(public prisma: PrismaService,
    @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy,
    private apiHttp: ApiHttp,
    private paginationService: PaginationService) { }

  async create(data: Prisma.ItemsUncheckedCreateInput): Promise<Model> {
    return this.prisma.items.create({
      data
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ItemsWhereUniqueInput;
    where?: Prisma.ItemsWhereInput;
    orderBy?: Prisma.ItemsOrderByWithRelationInput;
    page?: number,
    perPage?: number,
    wareHouseCode?: string
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy, wareHouseCode } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({ page: params.page, perPage: params.perPage });
      const result = await paginate<Model, Prisma.ItemsFindManyArgs>(
        this.prisma.items, {
        cursor,
        where,
        orderBy,
        include: {
          itemsWareHouses: { where: { warehouseCode: wareHouseCode } }
        },
      });
      let list = [];
      let today = new Date();
      result.data.map((item) => {
        const isEspecial = !!item.name.toLowerCase().includes('especial');
        let totalStock = (item.quantityOnStock - (item.quantityOrderedByCustomers || 0)) - 3;
        let estimatedDate = calculateEstimateDate(today, totalStock, isEspecial);
        list.push({
          ...item,
          estimatedDate: `${estimatedDate.getFullYear()}-${estimatedDate.getMonth() + 1}-${estimatedDate.getDate()}`
        });
      });
      const { data, ...items } = result
      return { ...items, data: list };
    } else {
      const result = await this.prisma.items.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          itemsWareHouses: { where: { warehouseCode: wareHouseCode } }
        },
      });
      let list = [];
      let today = new Date();
      result.map((item) => {
        const isEspecial = !!item.name.toLowerCase().includes('especial');
        let totalStock = (item.quantityOnStock - (item.quantityOrderedByCustomers || 0)) - 3;
        let estimatedDate = calculateEstimateDate(today, totalStock, isEspecial);
        list.push({
          ...item,
          estimatedDate: `${estimatedDate.getFullYear()}-${estimatedDate.getMonth() + 1}-${estimatedDate.getDate()}`
        });
      });

      return list;
    }
  }

  findOne(itemsWhereUniqueInput: Prisma.ItemsWhereUniqueInput): Promise<Model | null> {
    return this.prisma.items.findUnique({
      where: itemsWhereUniqueInput,
    });
  }

  update(params: {
    where: Prisma.ItemsWhereUniqueInput;
    data: Prisma.ItemsUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.items.update({
      data,
      where,
    });
  }

  remove(where: Prisma.ItemsWhereUniqueInput): Promise<Model> {
    return this.prisma.items.delete({
      where
    });
  }

  findByCode(code: string): Promise<Model | null> {
    return this.prisma.items.findFirst({
      where: { code }
    });
  }

  async findAllFromSap(search: string, stop: number) {
    try {
      const result = this.clientProxi.send('product/find-from-sap', { search, stop });
      const data = await firstValueFrom(result);
      return data.map((item) => {
        let price = item.ItemPrices.find((a) => a.PriceList == 1);
        let today = new Date();
        const isEspecial = !!item.ItemName.toLowerCase().includes('especial');
        let totalStock = (item.QuantityOnStock - (item.QuantityOrderedByCustomers || 0)) - 3;
        let estimatedDate = calculateEstimateDate(today, totalStock, isEspecial);
        return {
          name: item.ItemName,
          code: item.ItemCode,
          price: price ? price.Price : 0,
          quantityOnStock: item.QuantityOnStock,
          quantityOrderedFromVendors: item.QuantityOrderedFromVendors,
          quantityOrderedByCustomers: item.QuantityOrderedByCustomers,
          arTaxCode: item.ArTaxCode,
          estimatedDate: `${estimatedDate.getFullYear()}-${estimatedDate.getMonth() + 1}-${estimatedDate.getDate()}`
          // itemsWareHouses: {
          //     create: item.ItemWarehouseInfoCollection.map((w) => {
          //         const { WarehouseCode, InStock, ItemCode, Committed, Ordered } = w;
          //         // let wareHouse = wareHouses.find((a) => a.WarehouseCode == w.WarehouseCode);
          //         return {
          //             warehouseCode: WarehouseCode,
          //             warehouseName: wareHouse.WarehouseName,
          //             inStock: InStock,
          //             itemCode: ItemCode ,
          //             committed: Committed,
          //             ordered: Ordered                                           
          //         }
          //     })
          // }
        }

      })
    } catch (error) {

    }
  }

  async findAllStockFromSap(search: string, stop: number) {
    try {
      // const result = this.clientProxi.send('product/find-from-sap', { search, stop });
      // const data = await firstValueFrom(result);
      await this.apiHttp.login();
      const result = await this.apiHttp.get<any>(`${EnumApis.ITEM}?$select=ItemCode,ItemName,ArTaxCode,QuantityOnStock,ItemPrices,QuantityOrderedFromVendors,QuantityOrderedByCustomers,ItemWarehouseInfoCollection&$orderby=ItemName&$filter=contains(ItemName,'${search}') and Valid eq 'tYES'&$top=${stop}`);     
      const data = result.data.value;
      return data.map((item) => {
        let price = item.ItemPrices.find((a) => a.PriceList == 1);
        return {
          name: item.ItemName,
          code: item.ItemCode,
          price: price ? price.Price : 0,
          quantityOnStock: item.QuantityOnStock,
          quantityOrderedFromVendors: item.QuantityOrderedFromVendors,
          quantityOrderedByCustomers: item.QuantityOrderedByCustomers,
          arTaxCode: item.ArTaxCode,
          itemsWareHouses: item.ItemWarehouseInfoCollection.map((w) => {
            const { WarehouseCode, InStock, ItemCode, Committed, Ordered } = w;
            // let wareHouse = wareHouses.find((a) => a.WarehouseCode == w.WarehouseCode);
            return {
              warehouseCode: WarehouseCode,
              // warehouseName: wareHouse.WarehouseName,
              inStock: InStock,
              itemCode: ItemCode,
              committed: Committed,
              ordered: Ordered
            }
          })
        }
      });
    } catch (error) {

    }
  }


}
