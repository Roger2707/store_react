import { createSlice } from "@reduxjs/toolkit";
import { OrderDTO } from "../models/Order";

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

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setActivePaymentUI: (state, action) => {
            state.activePaymentUI = action.payload;
        }
    }
});

export const { setActivePaymentUI } = orderSlice.actions;