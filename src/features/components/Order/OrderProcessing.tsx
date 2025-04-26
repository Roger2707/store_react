import { useEffect, useState } from "react";
import styled from "styled-components";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { setNewClientSecret } from "../../../app/store/orderSlice";
import { useNavigate } from "react-router-dom";
import { ShippingAdressDTO } from "../../../app/models/User";

interface Props {
    shippingAddress : ShippingAdressDTO;
}

export const OrderProcessing = ({shippingAddress} : Props) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleOrderProcess = async () => {
        setLoading(true);
        try {       
            const {clientSecret} = await agent.Payment.createClientSecret(shippingAddress);
            setClientSecret(clientSecret);
        } catch (error) {
            
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        if(clientSecret) {
            dispatch(setNewClientSecret(clientSecret));
            navigate(`/checkout/${clientSecret}`);
        }
    }, [clientSecret, dispatch, navigate]);

    return (
        <Style>
            {
                !clientSecret &&
                (
                    <button onClick={handleOrderProcess} disabled={loading} >
                        {loading ? "Creating Order..." : "Order Now"}
                    </button>
                )
            }
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