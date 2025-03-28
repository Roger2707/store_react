import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components"
import { useCategories } from "../../Hooks/useCategories";
import { Category } from "../../../app/models/Category";
import { ProductParams } from "../../../app/models/Product";

interface Props {
    categoriesFilter: string;
    onSetCategoriesFilter: Dispatch<SetStateAction<ProductParams>>;
}

export const CategoryFilter = ({categoriesFilter, onSetCategoriesFilter}: Props) => { 
    const { data } = useCategories();
    const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);

    const handleSelectedCategory = (id: string) => {
        setCategoriesSelected(prev => {
            const current = [...prev];        
            if(current.filter(c => c === id).length > 0)
                return [...current.filter(c => c !== id)];
            return [...current, id];
        });
    }

    useEffect(() => {
        onSetCategoriesFilter(prev => ({...prev, filterByCategory: categoriesSelected.toString()}));
    }, [categoriesSelected, onSetCategoriesFilter])

    return(
        <Style className="filter_category-container" >
            <p>Category:</p>
            <div className="category-list" >
                {
                    data?.map((item: Category) => 
                        <button key={item.id} className={`${categoriesSelected.filter(c => c === item.id).length > 0 ? 'selected' : ''}`}
                            onClick={handleSelectedCategory.bind(null, item.id)}
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

    .category-list
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