import { forwardRef } from "react";
import styled from "styled-components";

interface Props {
    id: string
    value: any;
    placeholder?: string;
    type: string;
    onGetDataChange?: (e: any) => void;
    onGetDataEnter?: (e: any) => void;
    errors?: string[];
    readonly?: boolean;
    width?: string;
    disable?: boolean;
    marginTop?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(({id, value, placeholder, type, onGetDataChange, onGetDataEnter, readonly, width, marginTop, disable}, ref) => {   
    
    return (
        <Style className="input_container" >
            <input 
                id={id} type={type} value={value} placeholder={placeholder} 
                onChange={onGetDataChange}
                ref={ref} 
                onKeyDown={e => e.key === 'Enter' && onGetDataEnter && onGetDataEnter(e)}
                readOnly={readonly ? true: false}
                style={{width : `${width ? width : '100%'}`, marginTop: `${marginTop ? marginTop : '0'}`}}
                disabled={disable ? disable : false}
            />
            <span ></span>
        </Style>
    )
})

const Style = styled.div`
    
    label {
        display: block;
    }

    input {
        padding: 5px 8px;
        border-radius: 5px;
        border: none;
        outline: none;

        font-size: 1rem;
        
    }

    input[readonly] {
        pointer-events: none; 
        background-color: #f0f0f0; 
        color: #999;
        border: 1px solid #ccc;
    }

    input:disabled {
        background-color: #f5f5f5; 
        color: #999; 
        cursor: not-allowed; 
        opacity: 0.6; 
    }

    .error-message {
        display: block;
        width: 100%;
        font-size: 0.8rem;
        font-style: italic;
        color: #d82e2e;
        margin-top: 0.5vh;
        letter-spacing: 1px;

        animation: display linear 0.5s;
    }

    @keyframes display {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

`