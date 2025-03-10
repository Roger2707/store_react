import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { fetchUserAddressAsync } from "../../../app/store/userAddressSlice";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { OrderProcessing } from "../Order/OrderProcessing";

export const ConfirmAddress = () => {
    const {loadingUser, userAddresses} = useAppSelector(state => state.userAddress);
    const dispatch = useAppDispatch();
    const [selectedAddress, setSelectedAddress] = useState<number>(0);

    useEffect(() => {
        if(loadingUser) dispatch(fetchUserAddressAsync());
    }, [loadingUser, dispatch]);

    const handleChooseAddress = (value: number) => {
        setSelectedAddress(value);
    }

    return (
        <Style>
            {userAddresses.length === 0 && <Link to='/profile/address-info' className="link-to-create-address" >Add Shipping Address</Link>}
            {
                userAddresses.length > 0 &&
                <ul className="address-list" >
                    <h3>Select Shipping Address</h3>
                    {
                        userAddresses.map(address => {
                            const addressInfo = `${address.streetAddress}, ${address.district}, ${address.ward}, ${address.city}`;
                            return (
                                <li key={address.id} className="address-item" >
                                    <input  type="radio" value={address.id} name="shippingAddress" 
                                            checked={selectedAddress === address.id}
                                            onChange={(e) => handleChooseAddress(address.id)} 
                                            disabled={selectedAddress !== 0}
                                    /> <span>{addressInfo}</span>
                                </li>
                            )
                        })
                    }
                </ul>
            }
            {selectedAddress > 0 &&
                <div className="btn-order-container" >                
                    <OrderProcessing userAddressId = {selectedAddress} />
                </div>
            }
        </Style>
    )
}

const Style = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 2px solid #333;
    height: fit-content;

    padding: 1vh 1vw;
    margin-top: 3vh;

    .address-list {
        list-style: none;
        margin: 2vh 0;
        
        h3 {
            font-size: 1.5rem;
            font-weight: 500;
            color: #7F00FF;
            font-style: italic;
            letter-spacing: 1px;
        }

        .address-item {         
            margin: 1vh 0;
            span {
                font-style: italic;
                letter-spacing: 1px;
                word-spacing: 1px;
            }

            &:hover {
                cursor: pointer;
            }
        }
    }

    .btn-order-container {
        text-align: center;
        margin-bottom: 1.5vh;
    }

    .link-to-create-address {
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
        width: fit-content;
        &:hover {
            cursor: pointer;
            opacity: 1;
        }
    }
`