import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { categorySlice } from "./categorySlice";
import { brandSlice } from "./brandSlice";
import { promotionSlice } from "./promotionSlice";
import { userSlice } from "./userSlice";
import { basketSlice } from "./basketSlice";
import { orderSlice } from "./orderSlice";
import { warehouseslice } from "./warehouseSlice";


export const store = configureStore({
    reducer: {
        category: categorySlice.reducer,
        brand: brandSlice.reducer,
        promotion: promotionSlice.reducer,
        user: userSlice.reducer,
        warehouse: warehouseslice.reducer,
        basket: basketSlice.reducer,
        order: orderSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;