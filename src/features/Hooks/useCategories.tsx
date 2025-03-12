import { useQuery } from "@tanstack/react-query";
import agent from "../../app/api/agent";

const fetchCategories = async () => {
    try {
        const data = agent.Categories.list();
        return data;
    }
    catch(error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
    }
};
  
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => fetchCategories(),
        //keepPreviousData: true,
    });
};