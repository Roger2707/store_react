import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components"
import { ProductParams } from "../../../app/models/Product";
import { useBrands } from "../../Hooks/useBrands";
import { Brand } from "../../../app/models/Brand";

interface Props {
    brandsFilter: string;
    onSetBrandsFilter: Dispatch<SetStateAction<ProductParams>>;
}

export const BrandsFilter = ({brandsFilter, onSetBrandsFilter}: Props) => {
    const {data} = useBrands();
    
    const [brandsSelected, setBrandsSelected] = useState<number[]>([]);

    const handleSelectedBrands = (id: number) => {
        setBrandsSelected(prev => {
            const current = [...prev];    
            if(current.filter(c => c === id).length > 0) 
                return [...current.filter(c => c !== id)];
            return [...current, id];
        });
    }

    useEffect(() => {
        onSetBrandsFilter(prev => ({...prev, filterByBrand: brandsSelected.toString()}))
    }, [brandsSelected, onSetBrandsFilter])
    
    return (
        <Style className="filter_brands-container" >
            <p>Brands:</p>
            <div className="brands-list" >
                {
                    data?.map((item: Brand) => 
                        <button key={item.id} className={`${brandsSelected.filter(c => c === item.id).length > 0 ? 'selected' : ''}`}
                            onClick={handleSelectedBrands.bind(null, item.id)}
                        >
                            {item.name}
                        </button>)
                }
            </div>
        </Style>
    )
}

const Style = styled.div`
    background-color: #353935;
    width: 100%;
    padding: 10% 0;

    p {
        font-size: 1.2rem;
        color: #fff;
        font-style: italic;
        margin: 0 10% 3% 10%;
    }

    .brands-list
    {
        display: flex;
        flex-direction: column;
        align-items: center;

        button {
            font-size: 1rem;
            padding: 5px 10px;
            font-weight: 700;
            text-transform: capitalize;
            color: goldenrod;
            width: 80%;
            border-radius: 5px;
            border: none;
            outline: none;
            display: block;
            cursor: pointer;
            margin-bottom: 3%;
        }

        .selected {
            background-color: #E2DFD2;
        }
    }
`