export interface StockUpsertDTO {
    stockId: string
    productDetailId: string
    warehouseId: string
    quantity: number
    transactionType: number
}

export interface StockDTO {
    productDetailId: string
    productName: string
    color: string
    price: number
    imageUrl: string
    categoryName: string
    brandName: string
    stockDetail : StockDetailDTO[]
}

export interface StockDetailDTO {
    stockId: string
    warehouseId: string
    warehouseName: string
    quantity: number
}