import styled from "styled-components"

interface Props {
    message: string
}

export const Loading = ({message}: Props) => {
    return (
        <LoadingStyles style={{backgroundColor: 'inherit'}} >
            <div className="spinner" ></div>
            <p className="message" >{message}</p>
        </LoadingStyles>
    )
}

const LoadingStyles = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f0f0;

    .spinner {
        border: 8px solid #ccc;
        border-top: 8px solid #3498db;
        border-radius: 50%;
        width: 10vw;
        height: 10vh;
        animation: spin 1s linear infinite;
    }

    .message {
        margin-top: 10px;
        font-size: 18px;
        color: #555;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
  
`

