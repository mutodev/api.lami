import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from '../../auth/auth.service';
import { PrismaService } from '../../commons/prisma.service';
import { OrderService } from '../order.service';

var isRunning = false;

@Injectable()
export class TaskOrderService {

    private readonly logger = new Logger(TaskOrderService.name);

    constructor(private prismaService: PrismaService,
        private orderService: OrderService,
        private authService: AuthService) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        try {
            if (!isRunning) {
                // await this.cacheManager.set('isRunning', 'yes');
                isRunning = true;
                console.log({ isRunning });
                console.log('Start Date createOrder', new Date());
                await this.createOrder();

                this.logger.debug('End createOrder queue yet.');
                console.log('End Date createOrder', new Date());
                isRunning = false;
                // await this.cacheManager.set('isRunning', 'no');
            } else {
                this.logger.debug('Processing createOrder queue yet.');
            }
        } catch (error) {
            // await this.cacheManager.set('isRunning', 'no');
            isRunning = false;
            this.logger.debug('End createOrder queue yet.');
            console.log('End Date createOrder', new Date());
        }
    }

    async createOrder() {
        try {

            const orders = await this.prismaService.order.findMany({ where: { sendToSap: false }, include: { customer: true, orderDetails: true } });

            if (orders.length > 0) {
                await Promise.all(orders.map(async (order) => {

                    try {

                        await this.authService.login();
                        const result = await this.orderService.create({
                            CardCode: order.customer.identification,
                            Series: order.serie,
                            DocDate: order.date.toISOString().replace('T', ' ').substring(0, 10),
                            DocDueDate: order.dueDate.toISOString().replace('T', ' ').substring(0, 10),
                            SalesPersonCode: order.salesPersonCode || '',
                            Comments: order.comments,
                            DiscountPercent: order.discount || 0,    
                            VatSum: order.vatTotal || 0,
                            DocTotal: order.total || 0,
                            DocumentLines: order.orderDetails.map((item) => {
                                return {
                                    ItemCode: item.itemCode,
                                    Quantity: item.amount,
                                    UnitPrice: item.value,
                                    DiscountPercent: item.discount || 0,
                                    //Price: item.value * item.amount,
                                    WarehouseCode: item.wareHouseCode || '',
                                    Project: item.project,
                                    ArTaxCode: item.arTaxCode
                                };
                            })
                        });
                        console.log('respuesta crear order', { result })
                        if (result.status === 201) {
                            order.sendToSap = true;
                            await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: true, docNumber: result.data.DocNum, integrationId: result.data.DocEntry } });
                        }

                    } catch (error) {
                        const message = (error?.response?.message && JSON.stringify(error?.response?.message)) || error?.message || error?.response?.statusText || error?.toString();
                        await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: false, messageError: message } });
                        console.log('cron crear order', { error })
                    }

                }));
            }

            this.logger.debug('Called when the current createCustomer');
        } catch (error) {
            this.logger.error(error);
        }
    }

}
