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
    
    const [brandsSelected, setBrandsSelected] = useState<string[]>([]);

    const handleSelectedBrands = (id: string) => {
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
            <p>Brands</p>
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

const Style = styled.div ` 
    width: 100%;
    padding: 10% 5%;
    position: relative;
    top: 25%;

    p {
        font-family: 'Courier New', Courier, monospace;
        font-size: 1.2rem;
        font-style: italic;
        text-align: center;
        padding: 2px;
        background-color: #fff;
        z-index: 5;
        position: absolute;
        top: 0%;
        left: 30%;
    }

    .brands-list
    {
        position: absolute;
        top: 50%;
        z-index: 3;

        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid #333;
        padding: 10px 0;

        width: 90%;

        button {
            font-size: 1rem;
            letter-spacing: 0.1vw;
            padding: 5px 10px;
            font-family: 'Courier New', Courier, monospace;
            text-transform: capitalize;
            width: 95%;
            border: none;
            outline: none;
            display: block;
            cursor: pointer;
            margin-bottom: 1%;
            &:hover {
                background-color: #6082B6;
                color: #fff;
            }
        }

        .selected {
            background-color: #6082B6;
            color: #fff;
        }
    }
`