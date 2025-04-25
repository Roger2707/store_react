import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components"
import { icons } from "../../../app/utils/helper";
import { useAppSelector } from "../../../app/store/configureStore";
import { useSignalIROrderStatusHub } from "../../Hooks/useSignalIROrderStatusHub";
import { OrderStatusSignal } from "../../../app/models/Order";

export const CheckOut = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();
    const {clientSecret} = useAppSelector(state => state.order);
    const connection = useSignalIROrderStatusHub(clientSecret);

    console.log(loading);
    console.log(connection);
    
    

    useEffect(() => {
        if (!connection) return;
    
        const handleOrderUpdate = (response: OrderStatusSignal) => {
            setLoading(false);

          if (response?.status === 0) {
            toast.success('Order created successfully via SignalR!', { icon: icons.success });
            navigate('/checkout-success', { state: {response} });
          }
        };
        connection.on("OrderCreated", handleOrderUpdate); 

        return () => {
            connection.off("OrderCreated", handleOrderUpdate);
        };
      }, [connection, navigate]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setMessage('');

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: "if_required",
        });

        if (error) {
            setLoading(false);
            setMessage(error.message || "Check out failed !");
            toast.error(error.message, {icon: icons.error});
        } 
        else if (paymentIntent?.status === "succeeded") {
            setMessage("Waiting for order creation...");
            toast.success("Payment confirmed. Waiting for order...", { icon: icons.success });
        } 
        else {
            setLoading(false);
            setMessage("Check out Incompleted !");
        }
    };

    return (
        <Style disabled={loading} >
            <form onSubmit={handleSubmit} >
                <PaymentElement />
                <button type="submit" disabled={!stripe || loading} style={{ marginTop: 10 }}>
                    {loading ? "Processing..." : "Check Out"}
                </button>
                {message && <p>{message}</p>}
            </form>          
        </Style>
    );
}

const Style = styled.div<{ disabled: boolean }>`
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")}; 

    form {
        button {
            padding: 1vh 1vw;
            border: none;
            outline: none;
            cursor: pointer;
            opacity: 0.6;
            color: #fff;
            background-color: #FF4433;
            font-size: 1.2rem;
            border-radius: 3px;

            &:hover {
                opacity: 1;
            }
        }
    }
`