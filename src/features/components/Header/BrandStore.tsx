import { Link } from "react-router-dom";
import styled from "styled-components";

const logo = require('../../assets/images/mainLogo.jpg');

interface Props {
    handleSetPage: (path: string) => void;
}

export const BrandStore = ({handleSetPage} : Props) => {
    return (
        <Link to='/' style={{color: 'white', textDecoration: 'none'}} onClick={() => handleSetPage('/')} >
            <BrandContainer>
                <IMG/>
                <BrandName>
                    <p>roger store</p>
                    <p>Becoming better every single day.</p>
                </BrandName>
            </BrandContainer>
        </Link>
    )
}

const BrandContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: fit-content;
    height: fit-content;
`

const BrandName = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    p:first-child {
        font-size: 25px;
        line-height: 1rem;
        font-weight: 700;

        letter-spacing: 1px;
        margin: 0;
        padding: 0;
        margin-left: 10px;

        text-transform: uppercase;
        font-family: 'Courier New', Courier, monospace;
        font-style: italic;
    }

    p:last-child {
        margin: 0;
        padding: 0;
        margin-left: 10px;
        margin-top: 5px;

        font-size: 12px;
        font-style: italic;
    }
`

const IMG = styled.div`
    width: 70px;
    height: 60px;

    border-radius: 50%;
    background-image: url(${logo});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
`