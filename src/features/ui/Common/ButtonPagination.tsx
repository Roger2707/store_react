import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { setProductParams } from "../../../app/store/productSlice";

interface Props {
    pageNumber: number;
}

export const ButtonPagination = ({pageNumber} : Props) => {

    const dispatch = useAppDispatch();
    const {productParams} = useAppSelector(state => state.product)

    const handleSetPage = () => {
        dispatch(setProductParams({currentPage: pageNumber}));
    }

    return (
        <Style onClick={handleSetPage} style={pageNumber === productParams.currentPage ? {background: '#333333c7', color: '#fff'} : {}} >
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