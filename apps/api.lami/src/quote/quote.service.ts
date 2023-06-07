import { Inject, Injectable } from '@nestjs/common';
import { Quote as Model, Prisma } from '@prisma/client';
import { PaginationService } from '../commons/services/pagination/pagination.service';
import { PrismaService } from '../commons/services/prisma.service';
import { createPdf } from './../commons/functions';
import { join } from 'path';

@Injectable()
export class QuoteService {

  constructor(public prisma: PrismaService,
    private paginationService: PaginationService) { }

  async create(data: Prisma.QuoteUncheckedCreateInput): Promise<Model> {
    console.log({ data: JSON.stringify(data) });
    const quote = await this.prisma.quote.findFirst({
      orderBy: {docNumber: 'desc'}
    });
    let docNumber = quote ? quote.docNumber + 1 : 1;
    return await this.prisma.quote.create({
      data: {
        ...data,
        docNumber
      }
    });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.QuoteWhereUniqueInput;
    where?: Prisma.QuoteWhereInput;
    orderBy?: Prisma.QuoteOrderByWithRelationInput;
    page?: number,
    perPage?: number
  }): Promise<Model[] | any> {
    const { skip, take, cursor, where, orderBy } = params;
    if (params.page > 0) {
      const paginate = this.paginationService.createPaginator({ page: params.page, perPage: params.perPage });
      return paginate<Model, Prisma.QuoteFindManyArgs>(
        this.prisma.quote, {
        cursor,
        where,
        orderBy,
        include: { customer: {include: {identificationType: true}} }
      });
    } else {
      return this.prisma.quote.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: { customer: {include: {identificationType: true}} }
      });
    }
  }

  async findOne(userWhereUniqueInput: Prisma.QuoteWhereUniqueInput): Promise<any> {
    const quote = await this.prisma.quote.findUnique({
      where: userWhereUniqueInput,
      include: {
        customer: true,
        quoteDetails: true
      }
    });
    const projects = await this.prisma.setting.findUnique({
      where: {
        name: 'Project'
      },
      include: {
        settingDetail: true
      }
    });

    const taxes = await this.prisma.setting.findUnique({
      where: {
        name: 'TAX'
      },
      include: {
        settingDetail: true
      }
    });

    const detail = quote.quoteDetails.map((d) => {
      const project = projects.settingDetail.find((p) => p.code == d.project);
      const tax = taxes.settingDetail.find((p) => p.code == d.arTaxCode);
      return {...d, taxObj: tax, projectObj: project};
    });
    let setting = {}; 
    if (quote.salesPersonCode)
      setting = await this.prisma.settingDetail.findFirst({where: {setting: {name: 'SalesPersonCode',}, code: quote.salesPersonCode}});
    const {quoteDetails, ...orderObj} = quote;
    return {...orderObj, quoteDetails: detail, salesPerson: setting};
  }

  update(params: {
    where: Prisma.QuoteWhereUniqueInput;
    data: Prisma.QuoteUncheckedUpdateInput;
  }): Promise<Model> {
    const { where, data } = params;
    return this.prisma.quote.update({
      data: {...data},
      where,
    });
  }

  remove(where: Prisma.QuoteWhereUniqueInput): Promise<Model> {
    return this.prisma.quote.delete({
      where
    });
  }

  async generatePdf(where: Prisma.QuoteWhereUniqueInput) {
    const quote = await this.prisma.quote.findUnique({
      where,
      include: {
        customer: true,
        quoteDetails: true,
      }
    });
    const projects = await this.prisma.setting.findUnique({
      where: {
        name: 'Project'
      },
      include: {
        settingDetail: true
      }
    });

    const taxes = await this.prisma.setting.findUnique({
      where: {
        name: 'TAX'
      },
      include: {
        settingDetail: true
      }
    });
    const detail = quote.quoteDetails.map((d) => {
      const project = projects.settingDetail.find((p) => p.code == d.project);
      const tax = taxes.settingDetail.find((p) => p.code == d.arTaxCode);
      return {...d, taxObj: tax, projectObj: project};
    });

    let setting = await this.prisma.settingDetail.findFirst({where: {setting: {name: 'SalesPersonCode',}, code: quote.salesPersonCode}});
    const {quoteDetails, ...quoteObj} = quote;
    return await createPdf(join(__dirname, "./templates/quote.ejs"), {...quoteObj, quoteDetails: detail, salesPerson: setting});
  }

  async findCustomerByOrder(userWhereUniqueInput: Prisma.QuoteWhereUniqueInput): Promise<any> {
    const order = await this.prisma.quote.findUnique({
      where: userWhereUniqueInput,
      select: {id: true, customer: true}
    });
    return order.customer;
  }

  async findDetailByOrder(userWhereUniqueInput: Prisma.QuoteWhereUniqueInput): Promise<any> {
    const order = await this.prisma.quote.findUnique({
      where: userWhereUniqueInput,
      select: {id: true, quoteDetails: true}
    });
    return order.quoteDetails;
  }

}
