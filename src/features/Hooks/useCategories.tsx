import { useQuery } from "@tanstack/react-query";
import agent from "../../app/api/agent";
import { Category } from "../../app/models/Category";

const fetchCategories = async () : Promise<Category[]> => {
    try {
        const data = await agent.Categories.list();
        return data as Category[];
    }
    catch(error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
    }
};
  
export const useCategories = () => {
    return useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => fetchCategories(),
        //keepPreviousData: true,
    });
};