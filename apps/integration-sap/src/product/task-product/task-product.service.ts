import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from '../../auth/auth.service';
import { PrismaService } from '../../commons/prisma.service';
import { WarehoureService } from '../../warehoure/warehoure.service';
import { ProductService } from '../product.service';

var isRunning = false;

@Injectable()
export class TaskProductService {

    private readonly logger = new Logger(TaskProductService.name);

    constructor(private prismaService: PrismaService,
        private productService: ProductService,
        private wareHouseService: WarehoureService) { }


    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron6AM() {
        try {
            if (!isRunning) {
                // await this.cacheManager.set('isRunning', 'yes');
                isRunning = true;
                console.log({ isRunning });
                console.log('Start Date handleCron6AM', new Date());
                await this.migrateItems();

                this.logger.debug('End posting queue yet handleCron6AM.');
                console.log('End Date handleCron6AM', new Date());
                isRunning = false;
                // await this.cacheManager.set('isRunning', 'no');
            } else {
                this.logger.debug('Processing queue yet handleCron6AM.');
            }
        } catch (error) {
            // await this.cacheManager.set('isRunning', 'no');
            isRunning = false;
            this.logger.debug('End posting queue yet handleCron6AM.');
            console.log('End Date handleCron6AM', new Date());
        }
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCronNoon() {
        try {
            if (!isRunning) {
                // await this.cacheManager.set('isRunning', 'yes');
                isRunning = true;
                console.log({ isRunning });
                console.log('Start Date handleCronNoon', new Date());
                await this.migrateItems();

                this.logger.debug('End posting queue yet handleCronNoon.');
                console.log('End Date handleCronNoon', new Date());
                isRunning = false;
                // await this.cacheManager.set('isRunning', 'no');
            } else {
                this.logger.debug('Processing queue yet handleCronNoon.');
            }
        } catch (error) {
            // await this.cacheManager.set('isRunning', 'no');
            isRunning = false;
            this.logger.debug('End posting queue yet handleCronNoon.');
            console.log('End Date handleCronNoon', new Date());
        }
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron4PM() {
        try {
            if (!isRunning) {
                // await this.cacheManager.set('isRunning', 'yes');
                isRunning = true;
                console.log({ isRunning });
                console.log('Start Date handleCron4PM', new Date());
                await this.migrateItems();

                this.logger.debug('End handleCron4PM queue yet.');
                console.log('End Date handleCron4PM', new Date());
                isRunning = false;
                // await this.cacheManager.set('isRunning', 'no');
            } else {
                this.logger.debug('Processing queue yet handleCron4PM.');
            }
        } catch (error) {
            // await this.cacheManager.set('isRunning', 'no');
            isRunning = false;
            this.logger.debug('End posting queue yet handleCron4PM.');
            console.log('End Date handleCron4PM', new Date());
        }
    }

    async migrateItems() {
        try {

            const result = await this.productService.findAll();
            // const resultWareHouses = await this.apiHttp.get<any>(`${EnumApis.WAREHOUSE}`);
            const resultWareHouses = await this.wareHouseService.findAll();
            const wareHouses: any[] = resultWareHouses.data.value;
            console.log({ result });
            await this.prismaService.items.deleteMany({});
            await Promise.all(result.data.value.map(async (item) => {
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
                })
            }));

        } catch (error) {
            console.log('migrateItems', error)
        }
    }


}
