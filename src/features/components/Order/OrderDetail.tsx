import styled from "styled-components"
import { OrderDTO } from "../../../app/models/Order"

interface Props {
    order: OrderDTO | null;
}

export const OrderDetail = ({order}: Props) => {
    return (
        <Style>
            <h3>Item List:</h3>
            <ul className="item-list" >
                {
                    order?.items.map((item, index) => {
                        return (
                            <li key={index} >
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
    border: 2px solid darkblue;
    padding: 2vh 1vw;
    height: fit-content;

    .item-list {
        margin-top: 3vh;
        list-style: none;

        li {
            display: grid;
            grid-template-columns: 6fr 1fr 3fr;
            grid-column-gap: 2vw;
            grid-row-gap: 2vh;

            font-size: 0.9rem;
        }
    }
`