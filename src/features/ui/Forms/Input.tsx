import styled from "styled-components";

interface Props {
    id: string;
    value: any;
    placeholder: string;
    type: string;
    onGetDataChange: (e: any) => void;
    errors?: string[];
}

export const Input = ({id, value, placeholder, type, onGetDataChange, errors} : Props) => {   
    
    return (
        <Style className="input_container" >
            <input id={id} type={type} value={value} placeholder={placeholder} onChange={onGetDataChange}/>
            <span ></span>
        </Style>
    )
}

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