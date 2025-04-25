import { Link, Navigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import { OrderStatusSignal } from "../../../app/models/Order";


export const CheckOutSuccess = () => {
    const location = useLocation();
    const orderStatusResponse : OrderStatusSignal = location.state?.response;

    if (!orderStatusResponse) {
        return <Navigate to="/" replace />;
    }

    return (
        <Style>
            <div className="checkout-success-text" >
                <h1>Thank you for shopping ! Your Order is successfully check out 😎😍😂</h1>
                <p>Order Id: {orderStatusResponse?.orderId} --- {orderStatusResponse?.status === 0 ? 'Pending' : ''}</p>
                <p>Check your Orders: <Link to='/orders' children='Click Here'/></p>
                <p>Home Page: <Link to='/' children='Click Here' /></p>
            </div>
        </Style>
    )
}

const Style = styled.div`
    display: flex;
    flex-direction: column;
    height: 88vh;
    justify-content: center;

    .checkout-success-text {
        background-color: #4e67b3;
        padding: 10vh 5vw;
        color: #fff;
        text-align: center;
        letter-spacing: 1px;
        word-spacing: 1px;
        font-style: italic;
        border-radius: 10px;

        h1 {
            font-size: 2rem;
            font-weight: 500;  
        }

        p {
            margin-top: 2vh;

            a {
                text-decoration: underline;
                display: inline-block;
                color: #fff;
                letter-spacing: 1px;
                cursor: pointer;
            }
        }
    }
`