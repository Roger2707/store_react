import styled from "styled-components"
import { OrderDTO, OrderUpdatStatusRequest } from "../../../app/models/Order"
import { useState } from "react";
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import agent from "../../../app/api/agent";

interface Props {
    orders: OrderDTO[] | null;
    onSetSelectedOrderId: any;
    isAdmin: boolean;
}

export const OrderTable = ({orders, onSetSelectedOrderId, isAdmin}: Props) => {
    const [orderId, setOrderId] = useState<string>('');
    const orderStatusData : DropdownData[] = [
        {
            title: 'Created',
            value: 0
        },
            {
            title: 'Prepared',
            value: 1
        },
        {
            title: 'Shipping',
            value: 2
        },
        {
            title: 'Shipped',
            value: 3
        },
        {
            title: 'Completed',
            value: 4
        }
    ];

    const handleShowOrderDetail = (orderId: string) => {
        setOrderId(orderId);
        onSetSelectedOrderId(orderId);
    }

    const handleRefundOrder = (orderId: string) => {
        
    }

    const handleUpdateOrderStatus = async (orderId: string, selectedValue: any) => {
        try {
            const request : OrderUpdatStatusRequest = {
                orderId: orderId,
                status: +selectedValue
            }

            await agent.Order.updateOrderStatus(request);

        } catch (error) {
            console.error(error);
        }
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
            {
                orders && orders.length > 0 &&
                <tbody>
                    {
                        orders.map((order: OrderDTO, index) => {
                            return (
                                <tr key={index} className={`${order.id === orderId && 'order-active'}`}>
                                    <td >{order.id}</td>
                                    <td>
                                        <span className="order-contact" >Email address: <span style={{color: 'goldenrod'}} >{order.email}</span></span>
                                        <span className="order-contact" >Phone number: <span style={{color: 'goldenrod'}} >{order.phoneNumber}</span></span>
                                    </td>
                                    <td>{order.orderDate && order.orderDate.toString().split('T')[0]}</td>
                                    <td style={{ whiteSpace: "pre-line" }}>
                                        <span className="order-address" >{order.shippingAddress.streetAddress}</span>
                                        <span className="order-address">{order.shippingAddress.district}</span>
                                        <span className="order-address">{order.shippingAddress.ward}</span>
                                        <span className="order-address">{order.shippingAddress.city}</span>
                                    </td>
                                    <td><span style={{color: 'red'}} >{order.grandTotal.toLocaleString('vi-VN')} VND</span></td>
                                    <td>
                                        <span className={`order-status order-status-${order.status.includes('Pending') ? 'pending' : order.status.includes('Completed') ? 'completed' : order.status.includes('Cancelled') ? 'cancelled' : order.status.includes('Shipping') ? 'shipping' : 'refund'}`} >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleShowOrderDetail(order.id)}>More</button>
                                        {!isAdmin && <button onClick={() => handleRefundOrder(order.id)}  style={{background: '#0096FF'}} >Refund</button>}
                                        {isAdmin && 
                                            <select value={orderStatusData.find(d => d.title === order.status)?.value ?? -1} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)} >
                                                {orderStatusData.map((status, index) => {
                                                    return (
                                                        <option key={index} value={status.value} style={{backgroundColor: '#425e75' }}>
                                                            {status.title}
                                                        </option>
                                                    )
                                                })}
                                            </select>   
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            }
        </OrderTableStyle>
    )
}

const OrderTableStyle = styled.table `
    font-size: 1rem;
    border: 1px solid #333;
    text-align: center;
    border-collapse: collapse;
    background-color: #fff;

    thead {
        tr {
            th {
                font-size: 1.2rem;
                font-weight: 500;
                color: #eb4242;
                text-transform: capitalize;
                padding: 1vh 1vw;
                font-style: italic;
        
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
                .order-status-shipping {
                    background-color: #FF7F50;
                }
                .order-status-cancelled {
                    background-color: #eb4242;
                }
                .order-status-refund {
                    background-color: #4682B4;
                }

                button {
                    padding: 1vh 1vw;
                    border-radius: 5px;
                    cursor: pointer;
                    background-color: #FA8072;
                    color: #333;
                    font-style: italic;
                    border: none;
                    outline: none;
                    font-size: 0.8rem;
                    min-width: 6vw;
                }

                &:last-child {
                    button {
                        opacity: 0.8;

                        &:last-child {
                            margin-top: .5vh;
                        }

                        &:hover {
                            opacity: 1;
                        }
                    }
                }
            }
        }

        .order-active {
            background-color: #E6E6FA;
            color: #333;
            border: solid 2px #8b5a5a;
        }
    }
`