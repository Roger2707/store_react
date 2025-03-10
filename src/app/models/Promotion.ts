export interface Promotion {
    id: number,
    brandId: number,
    brandName: string,
    categoryId: number,
    cayegoryName: string,
    startDate: Date,
    endDate: Date,
    percentageDiscount: number, 
}

export interface PromotionUpsert {
    categoryId: number,
    brandId: number,
    start: string,
    end: string,
    percentageDiscount: number, 
}