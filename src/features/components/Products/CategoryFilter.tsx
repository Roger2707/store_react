import { useEffect, useState } from "react";
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { setProductParams } from "../../../app/store/productSlice";
import { fetchCategoryAsync } from "../../../app/store/categorySlice";

export const CategoryFilter = () => {
    
    const {categories, status} = useAppSelector(state => state.category);
    const [categoriesSelected, setCategoriesSelected] = useState<number[]>([]);
    const dispatch = useAppDispatch();

    const handleSelectedCategory = (id: number) => {
        setCategoriesSelected(prev => {
            const current = [...prev];
            
            if(current.filter(c => c === id).length > 0) 
                return [...current.filter(c => c !== id)];
            return [...current, id];
        });
    }

    useEffect(() => {
        if(!status) dispatch(fetchCategoryAsync());
        // eslint-disable-next-line
    }, [status]);

    useEffect(() => {
        dispatch(setProductParams({filterByCategory: categoriesSelected.toString()}))     
    }, [dispatch, categoriesSelected]);
    
    return(
        <Style className="filter_category-container" >
            <p>Category:</p>
            <div className="category-list" >
                {
                    categories.map(item => 
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
    background-color: #353935;
    width: 100%;
    padding: 10% 0;

    p {
        font-size: 1.2rem;
        color: #fff;
        font-style: italic;
        margin: 0 10% 3% 10%;
    }

    .category-list
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