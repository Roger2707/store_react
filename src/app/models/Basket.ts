export interface BasketDTO {
    id: string,
    userId: number,
    items?: BasketItemDTO[],
    grandTotal: number,
}

export interface BasketItemDTO {
    basketItemId: string,
    productDetailId: string,
    productName: string,
    productFirstImage: string,
    quantity: number,
    originPrice: number,
    discountPercent: number,
    discountPrice: number,
    status: boolean
}

export interface BasketUpsertDTO {
    userId: number
    username: string
    productDetailId: string
    quantity: number
    mode: number
}

export interface BasketUpsertParam {
    productDetailId: string
    quantity: number
    mode: number
}