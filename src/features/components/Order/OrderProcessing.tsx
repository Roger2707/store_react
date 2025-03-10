import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import styled from "styled-components";
import agent from "../../../app/api/agent";
import { OrderResponseDTO } from "../../../app/models/Order";
import { CheckOut } from "../Payment/CheckOut";
import { useAppDispatch } from "../../../app/store/configureStore";
import { fetchOrdersAsync } from "../../../app/store/orderSlice";

interface Props {
    userAddressId : number;
}

export const OrderProcessing = ({userAddressId} : Props) => {
    const stripePromise = loadStripe("pk_test_51Q2DiyHB9Jej2CgzeyBT0Mh7iFaN7oOBZ2IUrOX0jtsCmLyZcNu3a2ESysNhTzGOTn0d4Ha04mKOSsEnn7qBIMo000DX1UUK28"); 
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleOrderProcess = async () => {
        setLoading(true);
        try {
            const orderResponse : OrderResponseDTO = await agent.Order.create(userAddressId);    
            setClientSecret(orderResponse.clientSecret);
        } catch (error) {
            
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        if(clientSecret) {
            dispatch(fetchOrdersAsync())
        }
    }, [clientSecret, dispatch]);

    return (
        <Style>
            {!clientSecret ? (
            <button onClick={handleOrderProcess} disabled={loading} >
                {loading ? "Creating Order..." : "Order Now"}
            </button>
            ) : (
                <Elements options={{ clientSecret }} stripe={stripePromise}>
                    <CheckOut />
                </Elements>
            )}
        </Style>
    )
}

const Style = styled.div`
    button {
        padding: 1vh 1.5vw;
        font-size: 1rem;
        border: none;
        border-radius: 2px;
        background-color: #144153;
        color: white;
        opacity: 0.8;
        text-decoration: none;
        text-transform: uppercase;
        text-align: center;
        &:hover {
            cursor: pointer;
            opacity: 1;
        }
    }
`