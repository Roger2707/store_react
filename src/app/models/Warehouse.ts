export interface Warehouse {
    id: string;
    name: string;
    location: string;
    isSuperAdminOnly: boolean;
}

export interface WarehouseSearch {
    name: string
    location: string
}

export interface WarehouseProductQuantity {
    warehouseId: string
    warehouseName: string
    quantity: number
}