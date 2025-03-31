export interface Product {
    id: string;
    name: string;
    description: string;

    imageUrl: string;
    publicId: string;

    created: Date;
    categoryId: string;
    categoryName: string;
    brandId: string;
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
    color: string;
    extraName: string;
    productStatus: string;
}

export interface ProductUpsert {
    id: string;
    name: string;
    description: string;

    imageUrl: string;
    publicId: string;

    created: string;
    categoryId: string;
    brandId: string;

    // Detail
    productDetails: ProductUpsertDetail[];
}

export interface ProductUpsertDetail {
    id: string;
    productid: string;
    price: number;
    color: string;
    extraName: string;
    productStatus: number;
}

export interface ProductTechnology {
    name : string,
    description: string,
    imageUrl: string,
}

export interface ProductWithDetail {
    productDetailId: string;
    imageUrl: string;
    color: string;
    categoryName: string;
    brandName: string;
    price: number;
    productName: string;
}