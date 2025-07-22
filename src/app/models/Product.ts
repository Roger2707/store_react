export interface ProductFullDetailDTO {
    productId: string
    productDetailId: string
    name: string
    description: string
    color: string
    extraName: string
    originPrice: number
    percentageDiscount: number
    discountPrice: number
    imageUrl: string
    publicId: string
    categoryName: string
    brandName: string
    brandCountry: string
    created: Date
    stars: number
    totalRow: number
    status: number
}

export interface ProductParams {
    minPrice: number
    maxPrice: number
    searchBy: string
    filterByCategory: string
    filterByBrand: string
    currentPage: number
}

export interface ProductDTO {
    id: string;
    name: string;
    description: string;
    created: Date;
    categoryName: string;
    brandName: string;
    brandCountry: string;
    totalRow: number

    details: ProductDetailDTO[],
}

export interface ProductDetailDTO {
    id: string;
    productid: string

    originPrice: number
    percentageDiscount: number
    discountPrice: number

    imageUrl: string
    publicId: string
    color: string
    extraName: string
    stars: number
    status: string
}

// CRUD DTOs

export interface ProductUpsertDTO {
    id: string
    name: string
    description: string
    created: string
    categoryId: string
    brandId: string

    // Detail
    productDetails: ProductUpsertDetailDTO[]
}

export interface ProductUpsertDetailDTO {
    id: string
    productid: string

    price: number
    color: string
    extraName: string
    status: number
    imageUrl: string
    publicId: string

}

export interface ProductTechnology {
    name: string,
    description: string,
    imageUrl: string,
}