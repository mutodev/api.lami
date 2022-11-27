import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { EnumCustomerType } from '../../commons/enum-customer-type';
import { PrismaService } from '../../commons/prisma.service';
import { CustomerService } from '../customer.service';

var isRunning = false;

@Injectable()
export class TaskCustomerService {

    private readonly logger = new Logger(TaskCustomerService.name);

    constructor(private prismaService: PrismaService,
        private customerService: CustomerService,
        private authService: AuthService,
        @Inject('CLIENT_SERVICE') private clientProxi: ClientProxy) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        try {
            if (!isRunning) {
                // await this.cacheManager.set('isRunning', 'yes');
                isRunning = true;
                console.log({ isRunning });
                console.log('Start Date posting', new Date());
                await this.createCustomer();

                this.logger.debug('End posting queue yet.');
                console.log('End Date posting', new Date());
                isRunning = false;
                // await this.cacheManager.set('isRunning', 'no');
            } else {
                this.logger.debug('Processing queue yet.');
            }
        } catch (error) {
            // await this.cacheManager.set('isRunning', 'no');
            isRunning = false;
            this.logger.debug('End posting queue yet.');
            console.log('End Date posting', new Date());
        }
    }

    async createCustomer() {
        try {

            const customers = await this.prismaService.customer.findMany({ where: { sendToSap: false }, include: { type: true, identificationType: true } });

            if (customers.length > 0) {
                await Promise.all(customers.map(async (customer) => {

                    try {

                        await this.authService.login();
                        const customerSap = await this.customerService.findOne(customer.codeUpdated);
                        console.log({ customerSap })
                        if (customerSap.status === 404) {
                            const result = await this.customerService.create({
                                CardCode: customer.identification,
                                CardName: EnumCustomerType.PersonaNatural ? `${customer.firstName} ${customer.lastName} ${customer.lastName2}` : customer.name,
                                Address: customer.address,
                                Phone1: customer.phone,
                                MailAddress: customer.address,
                                CardType: customer.source,
                                FederalTaxID: customer.FederalTaxID,
                                GroupCode: customer.groupCode,
                                PayTermsGrpCode: customer.payTermsGrpCode,
                                SalesPersonCode: customer.salesPersonCode,
                                EmailAddress: customer.email,
                                U_HBT_RegTrib: customer.U_HBT_RegTrib,
                                U_HBT_TipDoc: customer.identificationType.code,
                                U_HBT_MunMed: customer.U_HBT_MunMed,
                                U_HBT_TipEnt: customer.type.code,
                                U_HBT_Nombres: customer.firstNameBilling,
                                U_HBT_Apellido1: customer.lastNameBilling,
                                U_HBT_Apellido2: customer.lastName2Billing,
                                U_HBT_Nacional: customer.U_HBT_Nacional,
                                U_HBT_RegFis: customer.U_HBT_RegFis,
                                U_HBT_ResFis: customer.U_HBT_ResFis,
                                U_HBT_MedPag: customer.U_HBT_MedPag,
                                BPAddresses: {
                                    AddressName: customer.AddressName,
                                    Street: null,
                                    Block: null,
                                    ZipCode: null,
                                    City: null,
                                    County: null,
                                    Country: null,
                                    State: null,
                                    U_HBT_MunMed: customer.U_HBT_MunMed,
                                    U_HBT_DirMM: customer.U_HBT_DirMM
                                }

                            });
                            console.log('respuesta crear cliente', { result })
                            if (result.status === 201) {
                                customer.sendToSap = true;
                                await this.prismaService.customer.update({ where: { id: customer.id }, data: { sendToSap: true } });
                                this.clientProxi.emit('customer/change-status-sap', customer.id);
                            }
                        } else if (customerSap.status === 200) {
                            console.log('entro a update customer');
                            const { BPAddresses } = customerSap.data
                            const BPAddressesListString = JSON.stringify(BPAddresses);
                            const bPAddresses = {
                                AddressName: customer.AddressName,
                                Street: customer.Street,
                                Block: customer.Block,
                                ZipCode: customer.ZipCode,
                                City: customer.City,
                                County: customer.County,
                                Country: customer.Country,
                                State: customer.State,
                                U_HBT_MunMed: customer.U_HBT_MunMed,
                                U_HBT_DirMM: customer.U_HBT_DirMM
                            };
                            // const bPAddressesString = JSON.stringify(bPAddresses);
                            // const exists = BPAddressesListString.includes(bPAddressesString);

                            const body = {
                                CardCode: customer.identification,
                                CardName: EnumCustomerType.PersonaNatural ? `${customer.firstName} ${customer.lastName} ${customer.lastName2}` : customer.name,
                                Address: customer.address,
                                Phone1: customer.phone,
                                MailAddress: customer.address || customerSap.data?.MailAddress,
                                CardType: customer.cardType || customer.source,
                                FederalTaxID: customer.identification,
                                GroupCode: customer.groupCode,
                                PayTermsGrpCode: customer.payTermsGrpCode || customerSap.data?.PayTermsGrpCode,
                                SalesPersonCode: customer.salesPersonCode || customerSap.data?.SalesPersonCode,
                                EmailAddress: customer.email,
                                U_HBT_RegTrib: customer.U_HBT_RegTrib || customerSap.data?.U_HBT_RegTrib,
                                U_HBT_TipDoc: customer.identificationType.code || customerSap.data?.U_HBT_TipDoc,
                                U_HBT_MunMed: customer.U_HBT_MunMed || customerSap.data?.U_HBT_MunMed,
                                U_HBT_TipEnt: customer.type.code,
                                U_HBT_Nombres: customer.firstNameBilling || '',
                                U_HBT_Apellido1: customer.lastNameBilling || '',
                                U_HBT_Apellido2: customer.lastName2Billing || '',
                                U_HBT_Nacional: customer.U_HBT_Nacional,
                                U_HBT_RegFis: customer.U_HBT_RegFis || customerSap.data?.U_HBT_RegFis,
                                U_HBT_ResFis: customer.U_HBT_ResFis || customerSap.data?.U_HBT_ResFis,
                                U_HBT_MedPag: customer.U_HBT_MedPag || customerSap.data?.U_HBT_MedPag
                            };
                            // if (!exists) {
                            //     body['BPAddresses'] = bPAddresses;
                            // }
                            const result = await this.customerService.update(
                                customer.codeUpdated,
                                body
                            );
                            
                            if (result.status === 204) {
                                customer.sendToSap = true;
                                await this.prismaService.customer.update({ where: { id: customer.id }, data: { sendToSap: true } });
                                this.clientProxi.emit('customer/change-status-sap', customer.id);                            
                            }
                        } else {
                            await this.prismaService.customer.update({ where: { id: customer.id }, data: { sendToSap: false, messageError: customerSap.message } });
                        }

                    } catch (error) {
                        const message = (error?.response?.message && JSON.stringify(error?.response?.message)) || error?.message || error?.response?.statusText || error?.toString();
                        await this.prismaService.customer.update({ where: { id: customer.id }, data: { sendToSap: false, messageError: message } });
                        console.log('cron crear cliente', { error })
                    }

                }));
            }

            this.logger.debug('Called when the current createCustomer');
        } catch (error) {
            this.logger.error(error);
        }
    }


}
