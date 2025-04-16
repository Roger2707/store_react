import { Elements } from "@stripe/react-stripe-js"
import styled from "styled-components"
import { CheckOut } from "../../components/Payment/CheckOut"
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";

export const CheckoutPage = () => {
    const stripePromise = loadStripe("pk_test_51Q2DiyHB9Jej2CgzeyBT0Mh7iFaN7oOBZ2IUrOX0jtsCmLyZcNu3a2ESysNhTzGOTn0d4Ha04mKOSsEnn7qBIMo000DX1UUK28");
    const {clientSecret} = useParams();

    return (
        <Style>
            <Elements options={{ clientSecret }} stripe={stripePromise}>
                <CheckOut />
            </Elements>
        </Style>
    )
}

const Style = styled.div`
    
`