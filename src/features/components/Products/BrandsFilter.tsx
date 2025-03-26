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

const Style = styled.div ` 
    background-color: #2c2c2c;
    width: 100%;
    padding: 10% 0;

    p {
        font-size: 1.2rem;
        color: #fff;
        font-style: italic;
        margin: 0 10% 3% 10%;
        text-decoration: underline;
    }

    .brands-list
    {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 2vh;

        button {
            font-size: 1rem;
            letter-spacing: 0.1vw;
            padding: 5px 10px;
            font-family: 'Courier New', Courier, monospace;
            text-transform: capitalize;
            color: #fff;
            background-color: #2c2c2c;

            width: 95%;
            border: none;
            outline: none;
            display: block;
            cursor: pointer;
            margin-bottom: 1%;
            &:hover {
                background-color: rgba(255,255,255,0.2);
            }
        }

        .selected {
            background-color: rgba(255,255,255,0.2);
        }
    }
`