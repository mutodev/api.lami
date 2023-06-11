import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EasyconfigService } from 'nestjs-easyconfig';
import { AuthService } from '../../auth/auth.service';
import { EnumCustomerType } from '../../commons/enum-customer-type';
import { PrismaService } from '../../commons/prisma.service';
import { CustomerService } from '../../customer/customer.service';
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
        private customerService: CustomerService,
        private _env: EasyconfigService,
        @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        try {
            if (this._env.get('RUN_CRON') === 'no') return;
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

            const orders = await this.prismaService.order.findMany({ where: {OR: [{ sendToSap: false }, { sendToSap: null }]}, include: { customer: true, orderDetails: true } });

            if (orders.length > 0) {
                const settingDetail = await this.prismaService.settingDetail.findMany({where: {setting: { name: 'Project'}}});
                await Promise.all(orders.map(async (order) => {
                    if (!order.integrationId) {
                        try {       
                            // code: order.customer.payTermsGrpCode                 
                            const paymentTerm = await this.prismaService.setting.findUnique({where: {name: 'PayTermsGrpCode'}, include: {settingDetail: {where: {active: true, code: order.customer.payTermsGrpCode}}}});
                            await this.authService.login();
                            const codes = (paymentTerm.settingDetail[0].extendedData as any).codes;
                            const arrayIdentification = order.customer.identification.split('-');                        
                            let carcode = order.customer.typeId == EnumCustomerType.PersonaJuridica.toString() && arrayIdentification[1] && arrayIdentification[2] ? `${arrayIdentification[0]}-${arrayIdentification[1]}` : order.customer.identification;
                            try {
                                let customerSap = await this.customerService.findOne(carcode);
                                if (customerSap.status === 200) {
                                    carcode = customerSap.data.CardCode;                                
                                } else {
                                    let customerSap = await this.customerService.findOne(order.customer.identification);
                                    carcode = customerSap.data.CardCode;
                                }                            
                            } catch (error) {
                                console.log('createOrder', {error});
                            }
                            
                            const result = await this.orderService.create({
                                CardCode: carcode,
                                Series: +order.serie,
                                DocDate: order.date.toISOString().replace('T', ' ').substring(0, 10),
                                DocDueDate: order.dueDate.toISOString().replace('T', ' ').substring(0, 10),
                                SalesPersonCode: order.salesPersonCode || '',
                                Comments: order.comments,//`${order.comments}\n\n${order.orderDetails.map((d) => `${d.aditionalInfo}\n\n`)}`,
                                DiscountPercent: order.discount || 0,    
                                VatSum: order.vatTotal || 0,
                                DocTotal: order.total || 0,
                                DocumentLines: order.orderDetails.map((item) => {
                                    const project = settingDetail.find((d) => d.code == item.project);
                                    return {
                                        ItemCode: item.itemCode,
                                        Quantity: item.amount,
                                        UnitPrice: item.value,
                                        DiscountPercent: item.discount || 0,
                                        // Price: item.value * item.amount,
                                        WarehouseCode: item.wareHouseCode || null,
                                        ProjectCode: project.value,
                                        ArTaxCode: item.arTaxCode,
                                        CostingCode: codes?.factorCode,
                                        CostingCode2: codes?.factorCode2,
                                        COGSCostingCode3: 'VTA',
                                        COGSCostingCode2: codes?.factorCode2
                                    };
                                })
                            });
                            console.log('respuesta crear order', { result })
                            if (result.status === 201) {
                                const orderUpdate = await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: true, docNumber: result.data.DocNum, integrationId: result.data.DocEntry } });                                      
                                this.clientProxi.send('order/change-status-sap', order.id);
                                this.clientProxi.send('order/get-order-created', orderUpdate);
                            } else {
                                await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: false, messageError: result.message } });
                            }

                        } catch (error) {
                            const message = (error?.response?.message && JSON.stringify(error?.response?.message)) || error?.message || error?.response?.statusText || error?.toString();
                            await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: false, messageError: message } });
                            console.log('cron crear order', { error })
                        }
                    } else {
                        try {       
                            // code: order.customer.payTermsGrpCode                 
                            const paymentTerm = await this.prismaService.setting.findUnique({where: {name: 'PayTermsGrpCode'}, include: {settingDetail: {where: {active: true, code: order.customer.payTermsGrpCode}}}});
                            await this.authService.login();
                            const codes = (paymentTerm.settingDetail[0].extendedData as any).codes;
                            const arrayIdentification = order.customer.identification.split('-');                        
                            let carcode = order.customer.typeId == EnumCustomerType.PersonaJuridica.toString() && arrayIdentification[1] && arrayIdentification[2] ? `${arrayIdentification[0]}-${arrayIdentification[1]}` : order.customer.identification;
                            try {
                                let customerSap = await this.customerService.findOne(carcode);
                                if (customerSap.status === 200) {
                                    carcode = customerSap.data.CardCode;                                
                                } else {
                                    let customerSap = await this.customerService.findOne(order.customer.identification);
                                    carcode = customerSap.data.CardCode;
                                }                            
                            } catch (error) {
                                console.log('createOrder', {error});
                            }
                            
                            const result = await this.orderService.update(order.integrationId.toString(), {
                                CardCode: carcode,
                                Series: +order.serie,
                                // DocDate: order.date.toISOString().replace('T', ' ').substring(0, 10),
                                // DocDueDate: order.dueDate.toISOString().replace('T', ' ').substring(0, 10),
                                // SalesPersonCode: order.salesPersonCode || '',
                                Comments: order.comments,//`${order.comments}\n\n${order.orderDetails.map((d) => `${d.aditionalInfo}\n\n`)}`,
                                DiscountPercent: order.discount || 0,    
                                VatSum: order.vatTotal || 0,
                                DocTotal: order.total || 0,
                                DocumentLines: order.orderDetails.map((item) => {
                                    const project = settingDetail.find((d) => d.code == item.project);
                                    return {
                                        LineNum: item.lineNumber,
                                        ItemCode: item.itemCode,
                                        Quantity: item.amount,
                                        UnitPrice: item.value,
                                        DiscountPercent: item.discount || 0,
                                        // Price: item.value * item.amount,
                                        WarehouseCode: item.wareHouseCode || null,
                                        ProjectCode: project.value,
                                        ArTaxCode: item.arTaxCode,
                                        CostingCode: codes?.factorCode,
                                        CostingCode2: codes?.factorCode2,
                                        COGSCostingCode3: 'VTA',
                                        COGSCostingCode2: codes?.factorCode2
                                    };
                                })
                            });
                            console.log('respuesta crear order', { result })
                            if (result.status === 204) {
                                order.sendToSap = true;
                                const orderUpdate = await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: true } });
                                
                                this.clientProxi.send('order/change-status-sap', order.id);
                                this.clientProxi.send('order/get-order-created', orderUpdate);
                            } else {
                                await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: false, messageError: result.message } });
                            }

                        } catch (error) {
                            const message = (error?.response?.message && JSON.stringify(error?.response?.message)) || error?.message || error?.response?.statusText || error?.toString();
                            await this.prismaService.order.update({ where: { id: order.id }, data: { sendToSap: false, messageError: message } });
                            console.log('cron crear order', { error })
                        }
                    }

                }));
            }

            this.logger.debug('Called when the current createCustomer');
        } catch (error) {
            this.logger.error(error);
        }
    }

}
