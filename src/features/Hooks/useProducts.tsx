import { Product, ProductParams } from "../../app/models/Product";
import { useQuery } from "@tanstack/react-query";
import agent from "../../app/api/agent";
import { PaginationData } from "../../app/models/PaginationData";

const fetchProductsAsync = async (params: ProductParams) : Promise<PaginationData<Product>> => {
    try {
        const data = await agent.Product.list(params);
        return data as PaginationData<Product>;
    }
    catch(error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
};
  
export const useProducts = (params: ProductParams) => {
    return useQuery<PaginationData<Product>>({
        queryKey: ['products', params],
        queryFn: () => fetchProductsAsync(params),
        //keepPreviousData: true,
        // staleTime: Infinity, 
        initialData: {
            dataInCurrentPage: [],
            currentPage: 1,
            rowInPage: 0,
            totalRow: 0,
            totalPage: 0,
        } as PaginationData<Product>,
    });
};