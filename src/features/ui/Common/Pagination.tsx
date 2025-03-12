import styled from "styled-components";
import { ButtonPagination } from "./ButtonPagination";
import { ProductParams } from "../../../app/models/Product";
import { Dispatch, SetStateAction } from "react";

interface Props {
    totalPage: number;
    params: ProductParams;
    onSetParams: Dispatch<SetStateAction<ProductParams>>;
}

export const Pagination = ({totalPage, params, onSetParams}: Props) => {
    const nums = totalPage > 0 ? Array.from({ length: totalPage }, (_, i) => i + 1) : [];

    return (
        <PaginationStyle>
           {
            nums.map(num => {
                return (
                    <ButtonPagination key={num} pageNumber={num} params={params} onSetParams={onSetParams} />
                )
            })
           }
        </PaginationStyle>
    )
}

const PaginationStyle = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 10vh;
    button {
        padding: 10px;
        font-size: 1.2rem;
    }
`