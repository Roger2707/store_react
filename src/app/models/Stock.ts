export interface StockUpsertDTO {
    productDetailId: string;
    stockTransactionId: string;
    wareHouseId: string;
    quantity: number;
    transactionType: number;
}