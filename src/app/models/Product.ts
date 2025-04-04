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
    color: string;
    status: string;
    price: number;
    discountPrice: number;
    extraName: string;
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
    status: number;
}

export interface ProductTechnology {
    name : string,
    description: string,
    imageUrl: string,
}

export interface ProductSingleDetailDTO {
    productDetailId: string
    productName: string
    productFirstImage: string
    color: string
    originPrice: number
    discountPercent: number
    discountPrice: number
    categoryName: string
    brandName: string
}

export interface ProductSearch {
    productName: string
    minPrice: number
    maxPrice: number
    brandId: string
    categoryId: string
}