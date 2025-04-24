import { createSlice } from "@reduxjs/toolkit";
import { OrderDTO } from "../models/Order";

interface OrderState {
    orders: OrderDTO[] | null;
    isLoadOrders: boolean;

    //////////////////////////////
    clientSecret: string;
}

const initialState : OrderState = {
    orders: null,
    isLoadOrders: false,

    ////////////////////////////////
    clientSecret: '',
}

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setNewClientSecret: (state, action) => {
            state.clientSecret = action.payload;
        },
    }
});

export const { setNewClientSecret } = orderSlice.actions;