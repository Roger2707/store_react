import styled from "styled-components";
import agent from "../../../app/api/agent";
import { ShippingAdressDTO } from "../../../app/models/User";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { setActivePaymentUI } from "../../../app/store/orderSlice";

interface Props {
    shippingAddress: ShippingAdressDTO;
}

export const OrderProcessing = ({ shippingAddress }: Props) => {
    const { activePaymentUI } = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();

    const handleOrderProcess = async () => {
        try {
            dispatch(setActivePaymentUI(true));
            await agent.Payment.createClientSecret(shippingAddress);
        } catch (error) {
            console.log(error);
        }
        finally {
        }
    }

    return (
        <Style>
            {
                <button onClick={handleOrderProcess} disabled={activePaymentUI} >
                    {activePaymentUI ? "Creating Order..." : "Place Order"}
                </button>
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