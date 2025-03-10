import { Dispatch, SetStateAction } from "react";
import styled from "styled-components"

interface Props {
    placeholder: string;
    searchKey: string;
    onSetSearchKey: Dispatch<SetStateAction<string>>;
    onSubmitSearch: () => void;
}

export const SearchData = ({searchKey, onSetSearchKey, onSubmitSearch, placeholder}: Props) => {

    const handleSubmitSearch = (e: any) => {
        e.preventDefault();
        onSubmitSearch();  
    }

    return(
        <Style>
            <form onSubmit={handleSubmitSearch} >
                <input name='search' placeholder={placeholder} 
                    value={searchKey} 
                    onChange={(e) => onSetSearchKey(e.target.value)} />
            </form>
        </Style>
    )
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