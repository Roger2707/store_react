import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components"
import { icons } from "../../../app/utils/helper";
import { useSignalIROrderStatusHub } from "../../Hooks/useSignalIROrderStatusHub";

interface Props {
    orderId: number;
}

export const CheckOut = ({orderId} : Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();
    const connection = useSignalIROrderStatusHub();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setMessage("");

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message || "Check out failed !");
            toast.error(error.message, {icon: icons.error});
        } 
        else if (paymentIntent?.status === "succeeded") {
            setMessage("Check out successfully !");
            toast.success('Check out successfully !', {icon: icons.success});

            const orderUpdateMessage = {
                Id: orderId,
                OrderStatus: "Shipping", 
            };

            if (connection) {
                await connection.invoke('SendOrderUpdateToAdmin', orderUpdateMessage);
                await connection.invoke('SendOrderUpdateToUser', orderUpdateMessage);
            }

            navigate('/checkout-success');
        } 
        else {
            setMessage("Check out Incompleted !");
        }
        setLoading(false);
    };

    const updateOrderStatus = (message: { id: number; orderStatus: string }) => {
        // Update in orderSlice
        console.log(message);
    };

    useEffect(() => {
        if (!connection) return;
    
        const handleOrderUpdate = (message: { id: number; orderStatus: string }) => {
            updateOrderStatus(message);
        };
    
        // Params -> BE call 
        connection.on("ReceiveOrderUpdate", handleOrderUpdate);
    
        return () => {
            connection.off("ReceiveOrderUpdate", handleOrderUpdate);
        };
    }, [connection]);   

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
            background-color: palevioletred;
            font-size: 1.2rem;
            border-radius: 3px;

            &:hover {
                opacity: 1;
            }
        }
    }
`