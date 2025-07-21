import styled from "styled-components";

interface Props {
    value: any;
    placeholder: string;
    onGetDataChange: (e: any) => void;
    id: string;
}

export const Textarea = ({value, placeholder, onGetDataChange, id} : Props) => {
    return (
        <Style>
            <textarea id={id} value={value || undefined} rows={5} placeholder={placeholder} onChange={onGetDataChange} />
            <span></span>
        </Style>
    )
}

const Style = styled.div`
    
    textarea {
        width: 100%;
        margin-top: 5px;
        padding: 3px 5px;
        border-radius: 5px;
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