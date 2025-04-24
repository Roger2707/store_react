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
            console.log(clientSecret);
            
        }
    }, [clientSecret])

    return (
        <Style>
            <div className="checkout-success-text" >
                <h1>Thank you for shopping ! Your Order is successfully check out 😎😍😂</h1>
                <p>Order Id: {orderItems.length > 0 && orderItems[0].id}</p>
                <p>Check your Order Status: <Link to='/orders' children='Click Here'/></p>
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