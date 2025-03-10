export interface Basket {
    id: number,
    userId: number,
    items: BasketItem [],
}

export interface BasketItem {
    id: number,
    basketId: number,
    productId: number,
    quantity: number,
    status: boolean
}

export interface BasketDTO {
    id: number,
    userId: number,
    items: BasketItemDTO[],
    totalPrice: number,
    paymentIntentId: number,
    clientSecret: number
}

interface BasketItemDTO {
    basketItemId: number,
    productId: number,
    productName: string,
    productFirstImage: string,
    quantity: number,
    originPrice: number,
    discountPercent: number,
    discountPrice: number,
    status: boolean
}