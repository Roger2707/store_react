export interface Promotion {
    id: string,
    brandId: string,
    brandName: string,
    categoryId: string,
    categoryName: string,
    startDate: Date,
    endDate: Date,
    percentageDiscount: number, 
}

export interface PromotionUpsert {
    id: string,
    categoryId: string,
    categoryName?: string;
    brandId: string,
    brandName?: string;
    start: string,
    end: string,
    percentageDiscount: number, 
}