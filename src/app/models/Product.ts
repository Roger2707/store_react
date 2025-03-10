export interface Product {
    id: number;
    name: string;
    price: number;
    discountPrice: number;
    description: string;
    imageUrl: string;
    quantityInStock: number;
    productStatus: string;
    created: Date;
    categoryId: number;
    categoryName: string;
    brandId: number;
    brandName: string;
    brandCountry: string;
}

export interface ProductParams {
    orderBy: string,
    searchBy: string,
    filterByCategory: string,
    filterByBrand: string,
    currentPage: number,
}

export interface ProductUpsert {
    name: string;
    price: number;
    description: string;
    imageUrl: File[] | undefined | null;
    quantityInStock: number;
    productStatus: number;
    created: string;
    categoryId: number;
    brandId: number;

    [key: string]: any;
}

export interface ProductTechnology {
    name : string,
    description: string,
    imageUrl: string,
}