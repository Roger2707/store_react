export interface Product {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    productStatus: string;
    created: Date;
    categoryId: number;
    categoryName: string;
    brandId: number;
    brandName: string;
    brandCountry: string;
    details: ProductDetail[],
}

export interface ProductParams {
    orderBy: string,
    searchBy: string,
    filterByCategory: string,
    filterByBrand: string,
    currentPage: number,
}

export interface ProductDetail {
    id: string;
    productid: string;
    price: number;
    discountPrice: number;
    quantityInStock: number;
    color: string;
    extraName: string;
}

export interface ProductUpsert {
    id?: string;
    name: string;
    description: string;
    imageUrl: File[] | undefined | null;
    productStatus: number;
    created: string;
    categoryId: number;
    brandId: number;
    imageProps: string;

    [key: string]: any;

    // Detail
    productDetails: ProductUpsertDetail[];
}

export interface ProductUpsertDetail {
    id: string;
    productid: string;
    price: number;
    quantityInStock: number;
    color: string;
    extraName: string;
}

export interface ProductTechnology {
    name : string,
    description: string,
    imageUrl: string,
}