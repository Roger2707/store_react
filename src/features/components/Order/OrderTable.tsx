import styled from "styled-components"
import { OrderDTO } from "../../../app/models/Order"
import { useAppDispatch } from "../../../app/store/configureStore";
import { fetchOrderDetailAsync } from "../../../app/store/orderSlice";
import { useState } from "react";

interface Props {
    orders: OrderDTO[] | null;
}

export const OrderTable = ({orders}: Props) => {
    const [orderId, setOrderId] = useState<number>(0);
    const dispatch = useAppDispatch();

    const handleShowOrderDetail = (orderId: number) => {
        dispatch(fetchOrderDetailAsync(orderId));
        setOrderId(orderId);
    }

    return (
        <OrderTableStyle>
        <thead>
            <tr>
                <th>Order Id</th>
                <th>Contact</th>
                <th>Order Date</th>
                <th>Shipping Address</th>
                <th>Grand Total</th>
                <th>Status</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {
                orders && orders.length > 0 &&
                orders.map((order, index) => {
                    return (
                        <tr key={index} className={`${order.id === orderId && 'order-active'}`}>
                            <td >{order.id}</td>
                            <td>
                                <span className="order-contact" >{order.email}</span>
                                <span className="order-contact" >{order.phoneNumber}</span>
                            </td>
                            <td>{order.orderDate && order.orderDate.toString().split('T')[0]}</td>
                            <td style={{ whiteSpace: "pre-line" }}>
                                <span className="order-address" >{order.userAddress.streetAddress}</span>
                                <span className="order-address">{order.userAddress.district}</span>
                                <span className="order-address">{order.userAddress.ward}</span>
                                <span className="order-address">{order.userAddress.city}</span>
                            </td>
                            <td>{order.grandTotal.toLocaleString('vi-VN')} VND</td>
                            <td>
                                <span className={`order-status order-status-${order.status.includes('Pending') ? 'pending' : order.status.includes('Completed') ? 'completed' : 'error'}`} >{order.status}</span>
                            </td>
                            <td>
                                <button onClick={() => handleShowOrderDetail(order.id)}>Detail</button>
                            </td>
                        </tr>
                    )
                })
            }
        </tbody>
        </OrderTableStyle>
    )
}

const OrderTableStyle = styled.table `
    font-size: 1rem;
    border: 1px solid #333;
    text-align: center;
    border-collapse: collapse;

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
                font-size: 0.85rem;
                padding: 1vh 1vw;
                border-right: 1px solid #333;
                border-top: 1px solid #333;

                .order-contact {
                    display: block;
                    text-align: left;
                    font-style: italic;                  
                }

                .order-address {
                    display: block;
                    text-align: left;
                    font-style: italic;
                }

                .order-status {
                    display: inline-block;
                    color: white;
                    padding: 1vh 1vw;
                    font-style: italic;
                    border-radius: 5px;
                }

                .order-status-pending {
                    background-color: gray;
                }
                .order-status-completed {
                    background-color: #41c741;
                }
                .order-status-pending {
                    background-color: #eb4242;
                }

                button {
                    padding: 1vh 1vw;
                    border-radius: 5px;
                    cursor: pointer;
                    background-color: darkblue;
                    color: white;
                    font-style: italic;
                    border: none;
                    outline: none;
                    font-size: 0.8rem;
                }
            }
        }

        .order-active {
            background-color: #7F00FF;
            color: white;
            border: solid 2px #8b5a5a;
        }
    }
`