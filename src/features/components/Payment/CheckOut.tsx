import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components"
import { icons } from "../../../app/utils/helper";
import { useNavigate } from "react-router-dom";

export const CheckOut = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: "if_required",
        });

        if (error) {
            setLoading(false);
            toast.error(error.message, { icon: icons.error });
        }
        else if (paymentIntent?.status === "succeeded") {
            toast.success("Payment confirmed !", { icon: icons.success });
            navigate('/checkout-success');
        }
        else {
            setLoading(false);
        }
    };

    return (
        <Style disabled={loading} >
            <form onSubmit={handleSubmit} >
                <PaymentElement />
                <button type="submit" disabled={!stripe || loading} style={{ marginTop: 10 }}>
                    {loading ? "Processing..." : "Check Out"}
                </button>
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