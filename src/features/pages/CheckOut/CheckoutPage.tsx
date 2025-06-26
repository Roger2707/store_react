import { Elements } from "@stripe/react-stripe-js"
import styled from "styled-components"
import { CheckOut } from "../../components/Payment/CheckOut"
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate, useParams } from "react-router-dom";
import { ReactNode } from "react";
import DataTable from "../../ui/Data/DataTable";
import { useAppSelector } from "../../../app/store/configureStore";
import { toast } from "react-toastify";
import { icons } from "../../../app/utils/helper";

const logo = require('../../assets/images/stripe.jpg');

const columns = [
    { 
        key: 'productFirstImage',
        title: 'Photo', 
        render: (link: any) => {
            if (!link) return <p>No Image</p>;
            let src = link.toString().split(',')[0];
            return <img width={50} height={50} src={String(src)} alt="img" /> as ReactNode;
        }
    }, 
    {
        key: 'productName',
        title: 'Name'
    },
    {
        key: 'quantity',
        title: 'Quantity'
    },
    {
        key: 'discountPrice',
        title: 'Price',
        render: (price: any) => {
            return <p>{price.toLocaleString('vi-VN')}</p> as ReactNode;
        }
    },
];

export const CheckoutPage = () => {
    const stripePromise = loadStripe("pk_test_51Q2DiyHB9Jej2CgzeyBT0Mh7iFaN7oOBZ2IUrOX0jtsCmLyZcNu3a2ESysNhTzGOTn0d4Ha04mKOSsEnn7qBIMo000DX1UUK28");
    const navigate = useNavigate();
    const {clientSecret} = useParams();
    !clientSecret && toast.error(`Client secret is required !`, { icon: icons.error }) && navigate('/basket');
    const {basket} = useAppSelector(state => state.basket);

    return (
        <>
            <h2 style={{fontSize: '1.8rem', fontStyle: 'italic', letterSpacing: '1px', wordSpacing: '1px', textAlign: 'center', marginTop: '2vh', color: '#191970'}} >Check out:</h2>                
            <Style>
                <div>
                    <Elements options={{ clientSecret }} stripe={stripePromise}>
                        <CheckOut/>
                    </Elements>
                    <IMG/>
                </div>

                <StyleOrder>
                    <h3>Items:</h3>
                    <DataTable 
                        columns={columns}
                        data={basket?.items.filter(i => i.status !== false)!}
                        isCrudMode={false}
                    />
                </StyleOrder>
            </Style>
        </>
    )
}

const IMG = styled.div`
    width: 100%;
    height: 300px;

    background-image: url(${logo});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    margin-top: 3vh;
`

const Style = styled.div`
    display: grid;
    grid-template-columns: 8fr 2fr;
    grid-column-gap: 5vw;
    padding: 5vh 5vw;
`

const StyleOrder = styled.div`
    h3 {
        margin-bottom: 0.8vh;
        font-size: 1.3rem;
        font-style: italic;
        letter-spacing: 1px;
        word-spacing: 1px;
    }
`