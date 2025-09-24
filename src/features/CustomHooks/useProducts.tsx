import { ProductFullDetailDTO, ProductParams } from "../../app/models/Product";
import { useQuery } from "@tanstack/react-query";
import agent from "../../app/api/agent";
import { PaginationData } from "../../app/models/PaginationData";

const fetchProductsAsync = async (params: ProductParams): Promise<PaginationData<ProductFullDetailDTO>> => {
    try {
        const data = await agent.Product.list(params);
        return data as PaginationData<ProductFullDetailDTO>;
    }
    catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
};

export const useProducts = (params: ProductParams) => {
    return useQuery<PaginationData<ProductFullDetailDTO>>({
        queryKey: ['products', params],
        queryFn: () => fetchProductsAsync(params),
    });
};