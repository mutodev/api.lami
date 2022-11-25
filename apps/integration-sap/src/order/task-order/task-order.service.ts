import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from '../../auth/auth.service';
import { PrismaService } from '../../commons/prisma.service';
import { ProductService } from '../../product/product.service';
import { OrderService } from '../order.service';

var isRunning = false;

@Injectable()
export class TaskOrderService {

    private readonly logger = new Logger(TaskOrderService.name);

    constructor(private prismaService: PrismaService,
        private orderService: OrderService,
        private productService: ProductService,
        private authService: AuthService,
        @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy) { }

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

                        const setting = await this.prismaService.setting.findFirst({where: {name: 'Project'}, include: {settingDetail: true}});
                        // const projects = await this.prismaService.settingDetail.findMany({where: {settingId: setting.id}})
                        await this.authService.login();
                        const result = await this.orderService.create({
                            CardCode: order.customer.identification,
                            Series: order.serie,
                            DocDate: order.date.toISOString().replace('T', ' ').substring(0, 10),
                            DocDueDate: order.dueDate.toISOString().replace('T', ' ').substring(0, 10),
                            SalesPersonCode: order.salesPersonCode || '',
                            Comments: `${order.comments}\n\n${order.orderDetails.map((d) => `${d.aditionalInfo}\n\n`)}`,
                            DiscountPercent: order.discount || 0,    
                            VatSum: order.vatTotal || 0,
                            DocTotal: order.total || 0,
                            DocumentLines: order.orderDetails.map((item) => {
                                const project = setting.settingDetail.find((d) => d.code == item.project);
                                return {
                                    ItemCode: item.itemCode,
                                    Quantity: item.amount,
                                    UnitPrice: item.value,
                                    DiscountPercent: item.discount || 0,
                                    // Price: item.value * item.amount,
                                    WarehouseCode: item.wareHouseCode || null,
                                    Project: project.value,
                                    ArTaxCode: item.arTaxCode
                                };
                            })
                        });
                        console.log('respuesta crear order', { result })
                        if (result.status === 201) {
                            order.sendToSap = true;
                            await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: true, docNumber: result.data.DocNum, integrationId: result.data.DocEntry } });
                             
                            order.orderDetails.map(async (detail) => {
                                try {
                                    const item = await this.productService.findOne(detail.itemCode, 'QuantityOnStock,QuantityOrderedFromVendors,QuantityOrderedByCustomers');
                                    await this.prismaService.items.updateMany({where: {code: detail.itemCode}, data: {quantityOnStock: item.data.QuantityOnStock,
                                                                                                    quantityOrderedFromVendors: item.data.QuantityOrderedFromVendors,
                                                                                                    quantityOrderedByCustomers: item.data.QuantityOrderedByCustomers}});
                                } catch (error) {
                                    console.log('update item', error);
                                }                               
                            });

                            this.clientProxi.send<string>('order/change-status-sap', {orderId: order.id});
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
