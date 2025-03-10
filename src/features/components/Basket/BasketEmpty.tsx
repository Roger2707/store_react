import { Link } from "react-router-dom"
import styled from "styled-components"

export const BasketEmpty = () => {
    return (
        <Style>
            <h1>Basket is empty now !</h1>
            <Link to={'/products'} >Shopping now</Link>
        </Style>
    )
}

const Style = styled.div`
    background-color: #6161cc;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5vh 5vw;
    border-radius: 20px;

    h1 {
        font-weight: 500;
        font-size: 1.5rem;
        text-align: center;
        color: white;
    }

    a {
        text-decoration: none;
        display: block;
        color: white;
        background-color: orangered;
        padding: 1vh 2vw;
        cursor: pointer;
        font-size: 1.2rem;
        margin-top: 2vh;
        opacity: 0.8;
        border-radius: 5px;
        &:hover {
            opacity: 1;
        }
    }
`