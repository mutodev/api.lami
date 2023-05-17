import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { successResponse } from '../commons/functions';
import { ItemsService } from '../items/items.service';
import { CustomerService } from '../customer/customer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../commons/guards';
import { Public } from '../commons/decorators';

@ApiTags('QUOTE')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService,
    private readonly itemsService: ItemsService,
    private readonly customerService: CustomerService) { }

  @Post()
  async create(@Req() req, @Body() createQuoteDto: CreateQuoteDto) {
    const { quoteDetails, ...order } = createQuoteDto;
    const customer = await this.customerService.findOne({ id: createQuoteDto.customerId });
    const details = await Promise.all(quoteDetails.map(async (detail) => {
      const item = await this.itemsService.findByCode(detail.itemCode);
      return { ...detail, arTaxCode: item.arTaxCode, project: customer.project || '0022' };
    }));
    const result = await this.quoteService.create({
      ...order, customerId: createQuoteDto.customerId, userId: req.user.id, quoteDetails: {
        create: [
          ...(details as any[])
        ]
      }
    });
    return successResponse('Cotización guardada satisfactoriamente.', result);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const result = await this.quoteService.findAll({ page: req['query'].page, perPage: req['query'].perPage, orderBy: { createdAt: 'desc' } });
    return successResponse('', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.quoteService.findOne({ id });
    return successResponse('', result);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    const { quoteDetails, ...order } = updateQuoteDto;
    const details = await Promise.all(quoteDetails.map(async (detail) => {
      const item = await this.itemsService.findByCode(detail.itemCode);
      return { ...detail, arTaxCode: item.arTaxCode }
    }));
    const result = await this.quoteService.update({
      where: { id }, data: {
        ...order, userId: req.user.id, quoteDetails: {
          create: [
            ...(details as any[])
          ]
        }
      }
    });
    return successResponse('Cotización actualizada satisfactoriamente.', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.quoteService.remove({ id });
    return successResponse('', result);
  }

  @Public()
  @Get('generate/pdf/:id')
  async generatePdf(@Param('id') id, @Res() res) {
    const buffer = await this.quoteService.generatePdf({id});
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=quote.pdf`,
      'Content-Length': buffer.length,
      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });
    res.end(buffer);
  }
}
