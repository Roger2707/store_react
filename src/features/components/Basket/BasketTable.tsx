import styled from "styled-components"
import { BasketDetailQuantity } from "./BasketDetailQuantity";
import { BasketChosen } from "./BasketChosen";
import { BasketDTO } from "../../../app/models/Basket";

interface Props {
    basket: BasketDTO | null;
}

export const BasketTable = ({basket} : Props) => {
    
    return (
        <Table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Image</th>
                    <th>Detail</th>
                    <th>Quantity</th>
                    <th>Sub Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    basket && 
                    basket.items.length > 0 &&
                    basket.items.map((basketItem, index) => {
                        return (
                            <tr key={index} >
                                <td>#{basketItem.productId.toString().padStart(6, '0')}</td>
                                <td>
                                    <img src={basketItem.productFirstImage} alt="img-first-basket" />
                                </td>
                                <td>
                                    <ul style={{padding: '0 1vw'}} >
                                        <li style={{textAlign: 'left'}}>
                                            <p>{basketItem.productName}</p>
                                        </li>
                                        <li style={{textAlign: 'left'}}>Origin Price: {basketItem.originPrice.toLocaleString("vi-VN")}</li>
                                        <li style={{textAlign: 'left'}}>Discount: {basketItem.discountPercent} %</li>
                                        <li style={{textAlign: 'left'}}>Discount Price: {basketItem.discountPrice.toLocaleString("vi-VN")}</li>
                                    </ul>
                                </td>
                                <td>
                                    <BasketDetailQuantity 
                                        productId={basketItem.productId} 
                                        quantity={basketItem.quantity}
                                    />
                                </td>
                                <td>{(basketItem.quantity * basketItem.discountPrice).toLocaleString("vi-VN")} VND</td>
                                <td>
                                    <BasketChosen basketItemId={basketItem.basketItemId} status={basketItem.status} />
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}

const Table = styled.table`
    font-size: 1rem;
    border: 1px solid #333;
    text-align: center;
    border-collapse: collapse;
    height: fit-content;

    thead {
        tr {
            th {
                font-size: 1.2rem;
                font-weight: 700;
                text-transform: capitalize;
                padding: 1vh 1vw;
        
                border-right: 1px solid #333;

                &:last-child {
                    border-right: none;
                }
            }
        }
    }

    tbody {
        width: 100%;

        tr{
            td {
                padding: 1.5vh 1vw;
                border-right: 1px solid #333;
                border-top: 1px solid #333;

                img {
                    width: 5vw;
                    height: 80%;
                }

                ul {
                    list-style: none;
                }
            }
        }
    }

`