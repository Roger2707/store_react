import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components"
import { Category } from "../../../app/models/Category";
import { ProductParams } from "../../../app/models/Product";
import { useAppSelector } from "../../../app/store/configureStore";

interface Props {
    categoriesFilter: string;
    onSetCategoriesFilter: Dispatch<SetStateAction<ProductParams>>;
}

export const CategoryFilter = ({categoriesFilter, onSetCategoriesFilter}: Props) => { 
    const { categories: data } = useAppSelector(state => state.category);
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

    useEffect(() => {
        if(categoriesFilter === '') setCategoriesSelected([]);      
    }, [categoriesFilter])
    
    return(
        <Style className="filter_category-container" >
            <p>Categories</p>
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
    width: 100%;
    padding: 10% 5%;
    position: relative;
    margin-top: 5vh;

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
        left: 20%;
    }

    .category-list
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