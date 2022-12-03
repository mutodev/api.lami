export class CreateCustomerDto {
    CardCode: string;
    CardName: string;
    Address: string;
    Phone1: string;
    MailAddress: string;    
    CardType?: string;
    County?: string;
    City?: string;
    FederalTaxID?: string;
    GroupCode?: string;
    PayTermsGrpCode?: string;
    SalesPersonCode?: string;
    EmailAddress?: string;
    U_HBT_RegTrib?: string;
    U_HBT_TipDoc?: string;
    U_HBT_MunMed?: string;
    U_HBT_TipEnt?: string;
    U_HBT_Nombres?: string;
    U_HBT_Apellido1?: string;
    U_HBT_Apellido2?: string;
    U_HBT_Nacional?: string;
    U_HBT_RegFis?: string;
    U_HBT_ResFis?: string;
    U_HBT_MedPag?: string;
    BPAddresses?: {
        AddressName?: string;
        Street?: string;
        Block?: string;
        ZipCode?: string;
        City?: string;
        County?: string;
        Country?: string;
        State?: string; 
        AddressType?: string;
        BPCode?: string;
        U_HBT_MunMed?: string;
        U_HBT_DirMM?: string;
    }[]
}


