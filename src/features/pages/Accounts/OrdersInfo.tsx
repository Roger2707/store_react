import styled from "styled-components"
import { OrderTable } from "../../components/Order/OrderTable"
import { OrderDetail } from "../../components/Order/OrderDetail"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { useEffect } from "react";
import { fetchOrdersAsync } from "../../../app/store/orderSlice";

export const OrdersInfo = () => {
    const {isLoadOrders, orders, orderSelected} = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();
    
    useEffect(() => {      
        if(!isLoadOrders) dispatch(fetchOrdersAsync());
    }, [isLoadOrders, dispatch]);
    
    return (
        <Style>
            <h1>Orders Infomations</h1>
            <div className="order-grid" >
                <OrderTable orders={orders} />
                {orderSelected && <OrderDetail order={orderSelected} />}
            </div>  
        </Style>
    )
}

const Style = styled.div`
    .order-grid {
        display: grid;
        grid-template-columns: 7fr 3fr;
        grid-column-gap: 5vw;
    }
`