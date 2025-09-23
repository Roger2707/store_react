import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderDTO, OrderUpdatStatusRequest } from "../models/Order";
import agent from "../api/agent";
import { DropdownData } from "../../features/ui/Forms/Dropdown";

interface OrderState {
    orders: OrderDTO[] | null;
    isLoadOrders: boolean;
    //////////////////////////////
    activePaymentUI: boolean;
}

const initialState: OrderState = {
    orders: null,
    isLoadOrders: false,
    ////////////////////////////////
    activePaymentUI: false
}

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
]

export const fetchAllOrdersAsync = createAsyncThunk<OrderDTO[]>(
    'orders/fetchAllOrdersAsync'
    , async (_, thunkAPI) => {
        try {
            const response = await agent.Order.getAllOrders();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const fetchOrdersCurrentUserAsync = createAsyncThunk<OrderDTO[]>(
    'orders/fetchOrdersOwnedAsync'
    , async (_, thunkAPI) => {
        try {
            const response = await agent.Order.getOrdersOwn();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const updateOrderStatus = createAsyncThunk<OrderUpdatStatusRequest, OrderUpdatStatusRequest>(
    'orders/update-order-status',
    async(request, thunkAPI) => {
        try {
            await agent.Order.updateOrderStatus(request);
            return request;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setActivePaymentUI: (state, action) => {
            state.activePaymentUI = action.payload;
        },
        setOrderStatus: (state, action) => {
            const orders : OrderDTO[] = JSON.parse(JSON.stringify(state.orders));
            const order = orders?.find(o => o.id === action.payload.orderId);
            if(order) {
                order.status = action.payload.orderStatusName;
            }
            state.orders = orders;
        }
    },
    extraReducers: builder => {
            // fetch All Orders
            builder.addCase(fetchAllOrdersAsync.pending, (state, action) => {
                state.isLoadOrders = false;
            });
    
            builder.addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
                state.orders = action.payload;
                console.log(state.orders);
                
                state.isLoadOrders = true;
            });
    
            builder.addCase(fetchAllOrdersAsync.rejected, (state, action) => {
                state.isLoadOrders = true;
            });

            // update order status
            builder.addCase(updateOrderStatus.pending, (state, action) => {

            });
    
            builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
                const orders : OrderDTO[] = JSON.parse(JSON.stringify(state.orders));
                if(!orders) return;
                state.orders = orders.map(o => o.id === action.payload.orderId ? {...o, status: orderStatusData.find(d => d.value === action.payload.orderStatus)!.title } : o);        
            });
    
            builder.addCase(updateOrderStatus.rejected, (state, action) => {

            });
        }
});

export const { setActivePaymentUI, setOrderStatus } = orderSlice.actions;