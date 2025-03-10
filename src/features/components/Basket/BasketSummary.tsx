import styled from "styled-components"
import { useAppSelector } from "../../../app/store/configureStore"

export const BasketSummary = () => {
    const {basket} = useAppSelector(state => state.basket);
    
    return (
        <Style>
            <h3>Summary:</h3>
            <div className="basket-list" >
                <p>Items: </p>
                <div style={{padding: '0 0 0 1vw'}} >
                    {
                        basket?.items.map((item) => {
                            return (
                                <div className="basket-item" key={item.basketItemId}>
                                    <p>💣{item.productName}</p>
                                    <p>{item.quantity}</p>
                                    <p>{(item.quantity * item.discountPrice).toLocaleString("vi-VN")}</p>
                                </div>
                            )
                        })
                    }
                </div>
                
                <div className="basket-item-price" >
                    <p>Total Items:</p>
                    <p>{basket?.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
                <div className="basket-item-price" >
                    <p>Grand Total:</p>
                    <p style={{color: 'red', fontSize: '1.5rem'}} >{(basket?.items.reduce((grand, item) => grand + (item.quantity * item.discountPrice), 0).toLocaleString("vi-VN"))}VND</p>
                </div>
            </div>
        </Style>
    )
}

const Style = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    border: 2px solid #333;
    padding: 1vh 1vw;
    height: fit-content;

    h3 {
        font-size: 1.5rem;
        font-weight: 500;
        color: #7F00FF;
        font-style: italic;
        letter-spacing: 1px;
    }

    .basket-list {
        margin: 1vh 0;

        .basket-item {
            display: grid;
            grid-template-columns: 6fr 1fr 3fr;
            margin: 0.5vh 0;

            p {
                &:nth-child(2) {
                    text-align: right;
                    color: darkblue;
                }
                &:last-child {
                    text-align: right;
                }
            }
        }

        .basket-item-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
`