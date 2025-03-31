export interface StockUpsertDTO {
    productDetailId: string;
    stockId: string;
    stockTransactionId: string;
    wareHouseId: string;
    quantity: number;
    transactionType: number;
}