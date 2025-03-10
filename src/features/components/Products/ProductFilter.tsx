import styled from "styled-components"
import { CategoryFilter } from "./CategoryFilter";
import { BrandsFilter } from "./BrandsFilter";

export const ProductFilter = () => {
    return (
        <FilterStyle>
            <CategoryFilter />
            <BrandsFilter/>
        </FilterStyle>
    )
}

const FilterStyle = styled.div `
    background-color: #343434;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
`