export class CreateOrderDto {
    CardCode: string;
    Series: number;
    DocDate?: string;
    DocDueDate?: string;
    SalesPersonCode?: string;
    Comments?: string;
    DiscountPercent: number;    
    VatSum: number;
    DocTotal: number;
    DocumentLines: {
            ItemCode: string;
            Quantity: number;
            UnitPrice: number;
            DiscountPercent?: number;
            Price?: number;
            WarehouseCode: string;
            Project?: string;
            ArTaxCode?: string;
        }[]
}
