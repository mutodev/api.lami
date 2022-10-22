import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { ApiHttp } from './commons/api-http.service';
import { PrismaService } from './commons/prisma.service';

@Injectable()
export class IntegrationSapService {

  constructor(private apiHttp: ApiHttp,
    private prismaService: PrismaService,
    private authService: AuthService) { }

  async migrateGrupos() {
    await this.authService.login();
    const result = await this.apiHttp.get<any>('/BusinessPartnerGroups');
    const setting = await this.prismaService.setting.create({
      data: {name: 'CUSTOMER_GROUP'}
    });
    console.log({result})
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
    return 'Migrado';
  }

  async migratePayTermsGrpCodes() {
    await this.authService.login();
    const result = await this.apiHttp.get<any>('/PaymentTermsTypes');
    const setting = await this.prismaService.setting.create({
      data: {name: 'PayTermsGrpCode'}
    });
    console.log({result})
    await Promise.all(result.data.value.map(async (item) => {
      // if (item.Type === 'bbpgt_CustomerGroup')
        await this.prismaService.settingDetail.create({
          data: {
            name: item.PaymentTermsGroupName,
            code: item.GroupNumber + "",
            settingId: setting.id
          }
        })
    }));
    return 'Migrado';
  }

  async migrateSalesPersonCode() {
    await this.authService.login();
    const result = await this.apiHttp.get<any>('/SalesPersons');
    const setting = await this.prismaService.setting.create({
      data: {name: 'SalesPersonCode'}
    });
    console.log({result})
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
    return 'Migrado';
  }

}
