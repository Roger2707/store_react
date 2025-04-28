import styled from "styled-components"
import { OrderTable } from "../../components/Order/OrderTable"
import { useEffect, useState } from "react";
import { OrderDetail } from "../../components/Order/OrderDetail";
import { OrderDTO, OrderItemDTO } from "../../../app/models/Order";
import agent from "../../../app/api/agent";
import { Loading } from "../../ui/Common/Loading";

export const OrdersSummary = () => {  
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [orders, setOrders] = useState<OrderDTO[] | null>(null);
    const [items, setItems] = useState<OrderItemDTO[] | null>(null);
    const [orderIdSelected, setOrderIdSelected] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {     
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const data = await agent.Order.getOrdersOwn();
                setOrders(data);
                console.log(data);
                
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        } 
        fetchOrders();
    }, []);
    
    useEffect(() => {
        if(orderIdSelected !== '') {
            setItems(prev => orders?.find(o => o.id === orderIdSelected)?.items!);
        }
        if(orderIdSelected === '') setItems(null);
    }, [orderIdSelected, orders])

    return (
        <Style>
            {isLoading && <Loading message='Loading orders ...' />}
            <h1>Orders Summary</h1>
            <div className="order-grid" >
                <OrderTable orders={orders?.slice((currentPage - 1) * 5, (currentPage - 1) * 5 + 5)!} onSetSelectedOrderId={setOrderIdSelected} />
                <OrderDetail items={items} />
            </div>
            <div className="paging" >
                {   orders && orders.length > 0 &&
                    Array.from({ length: orders.length / 5 }, (_, i) => (
                        <button key={i} className={`${currentPage === i + 1 && 'page-active'}`} onClick={() => {
                            setCurrentPage(i + 1);
                            setOrderIdSelected('');
                        }} >{i + 1}</button>
                    ))
                }
            </div>
        </Style>
    )
}

const Style = styled.div`
    h1 {
        font-size: 1.8rem;
        color: saddlebrown;
        font-style: italic;
        letter-spacing: 2px;
        word-spacing: 2px;
        margin-top: 3vh;
    }
    .order-grid {
        display: grid;
        grid-template-columns: 7fr 3fr;
        grid-column-gap: 5vw;

        margin-top: 3vh;
        margin-bottom: 5vh;
    }
    .paging {
        width: 100%;
        margin-bottom: 3vh;
        display: flex;
        justify-content: space-between;
        align-items: center;

        button {
            width: 35px;
            height: 42px;
            text-align: center;
            border-radius: 2px;
            font-size: 1.5rem;
            border: none;
            outline: none;
            background-color: #917e4f;
            cursor: pointer;
            color: #fff;

        }
        .page-active {
            background-color: brown;
        }
    }
`