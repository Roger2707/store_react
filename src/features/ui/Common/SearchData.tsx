import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components"
import { ProductParams } from "../../../app/models/Product";

interface Props {
    placeholder: string;
    searchKey: string;
    onSetSearchKey: Dispatch<SetStateAction<ProductParams>>;
}

export const SearchData = ({searchKey, onSetSearchKey, placeholder}: Props) => {
    const [inputValue, setInputValue] = useState(searchKey);

    // debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            onSetSearchKey(prev => ({ ...prev, searchBy: inputValue }));
        }, 1500);
        return () => clearTimeout(timeout); // cancelling timeOut if user keep on typing
    }, [inputValue, onSetSearchKey]);

    useEffect(() => {
        if(searchKey === '') setInputValue('');
    }, [searchKey])

    return (
        <Style>
            <input
                name='search'
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </Style>
    );
}

const Style = styled.div `
    width: 100%;
    input {
        width: 50%;
        background-color: #fff;
        padding: 10px 12px;
        border-radius: 50px;
        border: 1px solid #ccc;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease;

        font-size: 1rem;
        font-style: italic;

        &:focus {
            outline: none;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        }
    }


`