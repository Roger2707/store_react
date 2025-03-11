import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../api/agent";
import { OrderDTO } from "../models/Order";

interface OrderState {
    orders: OrderDTO[] | null;
    isLoadOrders: boolean;
    orderSelected: OrderDTO | null;
}

const initialState : OrderState = {
    orders: null,
    isLoadOrders: false,
    orderSelected: null,
}

export const fetchOrdersAsync = createAsyncThunk<OrderDTO[]>(
    'orders/fetchOrderAsync'
    , async(_, thunkAPI) => {
        try {
            const response = await agent.Order.list(); 
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const fetchOrderDetailAsync = createAsyncThunk<OrderDTO, number>(
    'orders/fetchOrderDetailAsync'
    , async(orderId, thunkAPI) => {
        try {
            const response = await agent.Order.get(orderId); 
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        updateOrderStatus: (state, action: PayloadAction<{orderId: number, status: number}>) => {
            if(!state.orders) return;
            const index = state.orders.findIndex(order => order.id === action.payload.orderId);  
            if (index !== -1) {
                switch (action.payload.status) {
                    case 0:
                        state.orders[index].status = 'Pending'
                        break;
                    case 1:
                        state.orders[index].status = 'Completed'
                        break;
                    case 2:
                        state.orders[index].status = 'Cancelled'
                        break;
                    case 3:
                        state.orders[index].status = 'Refunded'
                        break;
                }
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchOrdersAsync.pending, (state, action) => {
            state.isLoadOrders = false;
        });

        builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {         
            state.orders = action.payload;
            state.isLoadOrders = true;
        });

        builder.addCase(fetchOrdersAsync.rejected, (state, action) => {
            state.isLoadOrders = true;            
        });

        ////////////////////////////////////////////////////////////////////////
        builder.addCase(fetchOrderDetailAsync.pending, (state, action) => {

        });

        builder.addCase(fetchOrderDetailAsync.fulfilled, (state, action) => {         
            state.orderSelected = action.payload;
        });

        builder.addCase(fetchOrderDetailAsync.rejected, (state, action) => {
            
        });
    }
});

export const { updateOrderStatus } = orderSlice.actions;