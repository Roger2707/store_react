import styled from "styled-components";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../app/store/configureStore";

interface Props {
    onSetPage: (path: string) => void;
    currentPage: string;
}

export const BasketHeader = ({onSetPage, currentPage} : Props) => {
    const {basket} = useAppSelector(state => state.basket);
    const basketQuantity = basket?.items ? basket?.items?.reduce((total, item) => total + item.quantity, 0) : 0;

    return(
        <BasketStyles>
            <Link to='/basket' className="container" onClick={() => onSetPage('/basket')} >
                <span className={`basket-icon ${currentPage === '/basket' && 'basket-active'}`} ><FaCartShopping/></span>
                <span className={`basket-items ${currentPage === '/basket' && 'basket-active'}`} >{basketQuantity.toString().padStart(2, '0')}</span>
            </Link>
        </BasketStyles>
    )
}

const BasketStyles = styled.div`
    position: relative;
    width: 50px;
    height: 40px;

    color: white;
    text-decoration: none;
    .container {
        .basket-icon {
            position: absolute;
            top: 0;
            left: 0;

            font-size: 30px;
            color: white;
        }

        .basket-icon.basket-active {
            color: goldenrod;
            font-size: 35px;
        }

        .basket-items {
            position: absolute;
            bottom: 0;
            right: 10px;

            display: inline-block;
            padding: 5px;
            border-radius: 50%;
            background-color: #28282B;
            color: white;
            border: 0.1px solid #fff;
            font-size: 12px;
            font-weight: 700;
        }

        .basket-items.basket-active {
            background-color: goldenrod;
            color: #28282B;
        }
    }
`