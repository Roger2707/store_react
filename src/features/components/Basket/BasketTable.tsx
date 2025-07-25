import styled from "styled-components"
import { BasketDetailQuantity } from "./BasketDetailQuantity";
import { BasketChosen } from "./BasketChosen";
import { BasketDTO } from "../../../app/models/Basket";
import { useAppSelector } from "../../../app/store/configureStore";

interface Props {
    basket: BasketDTO | null;
}

export const BasketTable = ({ basket }: Props) => {
    const { activePaymentUI } = useAppSelector(state => state.order);
    return (
        <Table disabled={activePaymentUI} >
            <tbody>
                {
                    basket &&
                    basket.items && basket.items.length > 0 &&
                    basket.items.map((basketItem, index) => {
                        return (
                            <tr key={index} >
                                <td>
                                    <img src={basketItem.productFirstImage} alt="img-first-basket" />
                                </td>
                                <td>
                                    <ul style={{ padding: '0 1vw' }} >
                                        <li style={{ textAlign: 'left' }}>
                                            <p>{basketItem.productName}</p>
                                        </li>
                                        <li style={{ textAlign: 'left' }}>Origin Price: {basketItem.originPrice.toLocaleString("vi-VN")}</li>
                                        <li style={{ textAlign: 'left' }}>Discount: {basketItem.discountPercent} %</li>
                                        <li style={{ textAlign: 'left' }}>Discount Price: {basketItem.discountPrice.toLocaleString("vi-VN")}</li>
                                    </ul>
                                </td>
                                <td>
                                    <BasketDetailQuantity
                                        productDetailId={basketItem.productDetailId}
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

const Table = styled.table<{ disabled: boolean }> `
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")}; 

    font-size: 1rem;
    border: 1px solid #333;
    text-align: center;
    border-collapse: collapse;
    height: fit-content;

    tbody {
        width: 100%;
        background-color: #FFF5EE;

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