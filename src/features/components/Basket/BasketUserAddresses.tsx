import { useState } from "react";
import { useAppSelector } from "../../../app/store/configureStore";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { OrderProcessing } from "../Order/OrderProcessing";

export const BasketUserAddresses = () => {
    const {user} = useAppSelector(state => state.user);
    const {basket} = useAppSelector(state => state.basket);
    const selectedItem = basket?.items?.filter(item => item.status === true)?.length || 0;
    const [selectedAddress, setSelectedAddress] = useState<number>(0);

    const handleChooseAddress = (value: number) => {
        setSelectedAddress(value);
    }

    return (
        <>
            {
            user?.userAddresses[0].city === null ? 
                <Link 
                    to='/profile' 
                    style={{
                            padding: '1vh 1.5vw', fontSize: '1rem', border: 'none', borderRadius: '2px',
                            backgroundColor: '#144153', color: 'white', opacity: '0.8', textDecoration: 'none',
                            textTransform: 'uppercase',textAlign: 'center',width: 'fit-content',cursor: 'pointer',
                            display: 'inline-block', marginTop: '2vh'
                        }} >Add Shipping Address
                </Link>
            :
            <Style>
                {
                    user?.userAddresses && user.userAddresses.length > 0 &&
                    <ul className="address-list" >
                        <h3>Shipping Address</h3>
                        {
                            user.userAddresses?.map(address => {
                                const addressInfo = `${address.streetAddress}, ${address.district}, ${address.ward}, ${address.city}`;
                                return (
                                    <li key={address.id} className="address-item" >
                                        <input  type="radio" value={address.id} name="shippingAddress" 
                                                checked={selectedAddress === address.id}
                                                onChange={(e) => handleChooseAddress(address.id)} 
                                        /> <span>{addressInfo}</span>
                                    </li>
                                )
                            })
                        }
                        <>
                            {
                                selectedAddress <= 0 || selectedItem < 0 ?
                                <Link 
                                    to='/profile' 
                                    style={{
                                            padding: '1vh 1.5vw', fontSize: '1rem', border: 'none', borderRadius: '2px',
                                            backgroundColor: '#144153', color: 'white', opacity: '0.8', textDecoration: 'none',
                                            textTransform: 'uppercase',textAlign: 'center',width: 'fit-content',cursor: 'pointer',
                                            display: 'inline-block', marginTop: '2vh'
                                        }} >Use Another Shipping Address
                                </Link>

                                : ''
                            }
                        </>
                    </ul>
                }
                {
                    selectedAddress > 0 && selectedItem > 0 &&
                    (
                        <div className="btn-order-container" >                
                            <OrderProcessing userAddressId = {selectedAddress} />
                        </div>
                    )
                }
            </Style>
            }
        </>
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
    background-color: #EADDCA;
    border-radius: 10px;

    .address-list {
        list-style: none;    
        h3 {
            font-size: 1.5rem;
            font-weight: 500;
            color: #191970;
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
        margin-top: 0.5vh;
    }
`