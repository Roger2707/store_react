import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"
import styled from "styled-components"
import agent from "../../../app/api/agent";
import { OrderItemDapperRow } from "../../../app/models/Order";

export const CheckOutSuccess = () => {
    const location = useLocation();
    const clientSecret = location.state?.clientSecret;
    const [orderItems, setOrderItems] = useState<OrderItemDapperRow[]>([]);

    useEffect(() => {
        const getOrder = async () => {
            const result : OrderItemDapperRow[] = await agent.Order.getByClientSecret(clientSecret);
            setOrderItems(prev => result);
        }
        if(clientSecret) {
            getOrder();
        }
    }, [clientSecret])

    return (
        <Style>
            <div className="checkout-success-text" >
                <h1>Thank you for shopping ! Your Order is successfully check out 😎😍😂</h1>
                <p>Your Order : {orderItems[0]?.id} - {orderItems[0]?.orderStatus}</p>
                <p>See your Order Page: <Link to='/orders' children='Click Here'/></p>
                <p>Home Page: <Link to='/' children='Click Here' /></p>
            </div>
        </Style>
    )
}

const Style = styled.div`
    width: 100vw;
    height: 90vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

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