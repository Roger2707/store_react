import { useQuery } from "@tanstack/react-query";
import agent from "../../app/api/agent";

const fetchBrands = async () => {
    try {
        const data = agent.Brands.list();
        return data;
    }
    catch(error) {
        console.error('Error fetching brands:', error);
        throw new Error('Failed to fetch brands');
    }
};
  
export const useBrands = () => {
    return useQuery({
        queryKey: ['brands'],
        queryFn: () => fetchBrands(),
        //keepPreviousData: true,
    });
};