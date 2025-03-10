import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore"
import { fetchOrdersAsync } from "../../../app/store/orderSlice";
import styled from "styled-components";
import { OrderTable } from "../../components/Order/OrderTable";
import { OrderDetail } from "../../components/Order/OrderDetail";

export const Order = () => {
    const {isLoadOrders, orders, orderSelected} = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();
    
    useEffect(() => {      
        if(!isLoadOrders) dispatch(fetchOrdersAsync());
    }, [isLoadOrders, dispatch]);

    return (
        <Styled>
            <h2>Orders Summary</h2>
            <div className="order-grid" >
                <OrderTable orders={orders} />
                {orderSelected && <OrderDetail order={orderSelected} />}
            </div>     
        </Styled>
    )
}

const Styled = styled.div`
    padding: 5vh 10%;
    h2 {
        font-size: 2rem;
        font-weight: 500;
        color: #7F00FF;
        font-style: italic;
        letter-spacing: 1px;
        margin-bottom: 2vh;
    }

    .order-grid {
        display: grid;
        grid-template-columns: 7fr 3fr;
        grid-column-gap: 5vw;
    }
`