export interface OrderDTO {
    id: string;
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    orderDate: Date;
    status: string;
    deliveryFee: number;
    grandTotal: number;
    clientSecret: string;
    items: OrderItemDTO[];
    userAddress : {
        city: string;
        district: string;
        ward: string;
        streetAddress: string;
        country: string;
    }
}

export interface OrderItemDTO {
    id: number;
    productId: number;
    productName: string;
    productImageUrl: string;
    quantity: number;
    subTotal: number;
}

export interface OrderItemDapperRow {
    id: string
    orderDate: Date
    orderStatus: string
    deliveryFee: number
    clientSecret: string
    orderItemId: number
    productDetailId: string
    productName: string
    productImageUrl: string
    quantity: number
    subTotal: number
    grandTotal: number
}

export interface OrderStatusSignal {
    orderId: string
    status: number
}
