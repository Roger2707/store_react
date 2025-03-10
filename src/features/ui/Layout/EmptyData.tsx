import styled from "styled-components";

interface Props {
    message: string;
}

export const EmptyData = ({message} : Props) => {
    return(
        <Style style={{backgroundColor: 'inherit'}} >
            <p>{message}</p>
        </Style>
    )
}

const Style = styled.div`
    width: 100%;
    height: 80vh;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #fff;

    p {
        font-size: 2rem;
        padding: 15%;
        margin: 0 5%;
        border-radius: 20px;
        background-color: #6082B6;
        color: #fff;
        font-weight: 700;
    }
`