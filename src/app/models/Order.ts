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
    shippingAddress: ShippingAdress;
}

export interface OrderItemDTO {
    id: number;
    productId: number;
    productName: string;
    productImageUrl: string;
    quantity: number;
    subTotal: number;
}

export interface OrderStatusSignal {
    orderId: string
    status: number
}

export interface ShippingAdress {
    city : string;
    district: string;
    ward: string;
    streetAddress: string;
    postalCode: string;
    country: string;
}
