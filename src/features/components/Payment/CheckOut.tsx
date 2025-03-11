import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"

export const CheckOut = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

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
        } else if (paymentIntent?.status === "succeeded") {
            setMessage("Check out successfully !");
        } else {
            setMessage("Check out Incompleted !");
        }
        setLoading(false);
    };

    useEffect(() => {
        if(message.includes('successfully')) {
            navigate('/orders');
        }
    }, [message, navigate]);

    return (
        <Style>
            <form onSubmit={handleSubmit}>
                <PaymentElement />
                <button type="submit" disabled={!stripe || loading} style={{ marginTop: 10 }}>
                    {loading ? "Processing..." : "Check Out"}
                </button>
                {message && <p>{message}</p>}
            </form>
        </Style>
    );
}

const Style = styled.div`
    
`