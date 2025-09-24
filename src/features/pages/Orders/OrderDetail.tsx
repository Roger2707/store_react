import styled from "styled-components"
import { OrderItemDTO } from "../../../app/models/Order"

interface Props {
    items: OrderItemDTO[] | null;
}

export const OrderDetail = ({items}: Props) => {
    return (
        <Style>
            <h3>Order Detail:</h3>
            <ul className="item-list" >
                {
                    items?.map((item, index) => {
                        return (
                            <li key={index} >
                                <span><img src={item.productImageUrl.split(',')[0]} alt={item.productName} /></span>
                                <span>{item.productName}</span>
                                <span>{item.quantity}</span>
                                <span>{item.subTotal.toLocaleString('vi-VN')} VND</span>
                            </li>
                        )
                    })
                }
            </ul>
        </Style>
    )
}

const Style = styled.div`
    border: 2px solid #333;
    padding: 2vh 1vw;
    height: fit-content;

    h3 {
        font-size: 1.2rem;
        color: saddlebrown;
        font-style: italic;
        letter-spacing: 2px;
        word-spacing: 2px;
        text-decoration: underline;
    }

    .item-list {
        list-style: none;

        li {
            display: grid;
            grid-template-columns: 3fr 3fr 1fr 3fr;
            grid-column-gap: 2vw;
            font-size: 0.9rem;

            span {
                display: inline-block;
                margin-top: 1vh;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
`