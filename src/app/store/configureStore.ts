import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { categorySlice } from "./categorySlice";
import { brandSlice } from "./brandSlice";
import { promotionSlice } from "./promotionSlice";
import { accountSlice } from "./accountSlice";
import { userAddressSlice } from "./userAddressSlice";
import { basketSlice } from "./basketSlice";
import { orderSlice } from "./orderSlice";


export const store = configureStore({
    reducer: {
        category: categorySlice.reducer,
        brand: brandSlice.reducer,
        promotion: promotionSlice.reducer,
        account: accountSlice.reducer,
        userAddress: userAddressSlice.reducer,
        basket: basketSlice.reducer,
        order: orderSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;