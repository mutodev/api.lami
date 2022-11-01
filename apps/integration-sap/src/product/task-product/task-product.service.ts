import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from '../../auth/auth.service';
import { PrismaService } from '../../commons/prisma.service';
import { ProductService } from '../product.service';

@Injectable()
export class TaskProductService {

    private readonly logger = new Logger(TaskProductService.name);

    constructor(private prismaService: PrismaService,
        private productService: ProductService,
        private authService: AuthService) { }

    @Cron(CronExpression.EVERY_DAY_AT_6AM)
    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    @Cron(CronExpression.EVERY_DAY_AT_4PM)
    async migrateItems() {
        try {
            await this.authService.login();
            const result = await this.productService.findAll();
            console.log({ result });
            await this.prismaService.items.deleteMany();
            await Promise.all(result.data.value.map(async (item) => {
                let price = item.ItemPrices.find((a) => a.PriceList == 1)
                await this.prismaService.items.create({
                    data: {
                        name: item.ItemName,
                        code: item.ItemCode,
                        price: price ? price.Price : 0,
                        quantityOnStock: item.QuantityOnStock,
                        quantityOrderedFromVendors: item.QuantityOrderedFromVendors,
                        quantityOrderedByCustomers: item.QuantityOrderedByCustomers,
                    }
                })
            }));
        } catch (error) {
            console.log('migrateItems', error)
        }
    }


}
