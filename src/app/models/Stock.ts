export interface StockUpsertDTO {
    productDetailId: string;
    stockId: string;
    stockTransactionId: string;
    warehouseId: string;
    quantity: number;
    transactionType: number;
}