import styled from "styled-components"
import { ProductParams } from "../../../app/models/Product";
import { Dispatch, SetStateAction } from "react";

interface Props {
    pageNumber: number;
    params : ProductParams;
    onSetParams: Dispatch<SetStateAction<ProductParams>>;
}

export const ButtonPagination = ({pageNumber, params, onSetParams} : Props) => {
    const handleSetPage = () => {
        onSetParams({...params, currentPage: pageNumber});
    }

    return (
        <Style onClick={handleSetPage} style={pageNumber === params.currentPage ? {background: '#333333c7', color: '#fff'} : {}} >
            {pageNumber}
        </Style>
    )
}

const Style = styled.button `
    width: 3vw;
    height: 3vh;
    padding: 5px 10px;
    font-size: 1rem;
    
    display: flex;
    justify-content: center;
    align-items: center;

    border: 1px solid #333;
    border-radius: 2px;
    cursor: pointer;
    outline: none;
    transition: all linear 0.2s;

    &:hover {
        background-color: #4c98c4;
        color: #fff
    }
`