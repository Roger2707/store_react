import { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";
import { formatPrice } from "../../../app/utils/helper";

interface Props {
    id: string;
    value: any;
    placeholder?: string;
    type: string;
    onGetDataChange: (e: any) => void;
    errors?: string[];
    readonly?: boolean;
    width?: string;
}

export const InputMoney = forwardRef<HTMLInputElement, Props>(({id, value, placeholder, type, onGetDataChange, errors, readonly, width}, ref) => {
    const [inputValue, setInputValue] = useState<string>(formatPrice(value));

    useEffect(()=> {
        if(value || +value === 0) {
            setInputValue(formatPrice(value));
        }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);
    };

    const handleBlur = () => {
        const rawValue = inputValue.replace(/[^0-9.]/g, '');
        const numericValue = parseFloat(rawValue);

        if (!isNaN(numericValue)) {
            onGetDataChange(numericValue);
            setInputValue(formatPrice(numericValue)); 
        } else {
            onGetDataChange(0); 
            setInputValue('');
        }
    };

    return (
        <Style className="input_container" >
            <input 
                id={id} type={type} 
                value={inputValue} 
                placeholder={placeholder} 
                onChange={handleChange} 
                onBlur={handleBlur}
                ref={ref} 
                readOnly={readonly ? true: false}
                style={{width : `${width ? width : '100%'}`}}
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
        width: 100%;
        margin-top: 5px;
        padding: 5px 8px;
        border-radius: 5px;
        border: none;
        outline: none;

        font-size: 1rem;
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