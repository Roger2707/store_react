import { Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { ProductParams } from "../../../app/models/Product";

interface SortOption {
    title: string;
    value: string;
}

interface Props {
    selectedValue: string;
    onSetSelectedValue: Dispatch<SetStateAction<ProductParams>>;
    sortOptions: SortOption[];
}

export const SortData = ({ selectedValue, onSetSelectedValue, sortOptions }: Props) => {

    const handleSubmit = (e: any) => {
        onSetSelectedValue(prev => ({ ...prev, sortBy: e.target.value }));
    }

    return (
        <Style>
            <select value={selectedValue} onChange={(e: any) => handleSubmit(e)} >
                {sortOptions.map((option, index) => <option key={index} value={option.value} >{option.title}</option>)}
            </select>
        </Style>
    )
}

const Style = styled.div`
    select {
        font-size: 1rem;
        font-style: italic;
        color: #5f5050;
        padding: 5px 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        background-color: #CCCCFF;

        &:focus {
            outline: none;
        }

        option {
            padding: 5px 10px;
            background-color: #c5c5d8;
            color: #333;
        }
    }
`