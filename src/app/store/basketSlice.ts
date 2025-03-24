import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BasketDTO } from "../models/Basket";
import agent from "../api/agent";

interface BasketState {
    basket: BasketDTO | null,
    loadingState: boolean,
    isLoadBasket: boolean,
}

const initialState : BasketState = {
    basket: null,
    loadingState: false,
    isLoadBasket: false
}

export const getBasket = createAsyncThunk<BasketDTO>(
    'basket/get-basket',
    async(_, thunkAPI) => {
        try {
            const basket = await agent.Basket.get();
            return basket;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const upsertBasket = createAsyncThunk<BasketDTO, {productId: string, mode: number}>(
    'basket/upsert-basket',
    async({productId, mode}, thunkAPI) => {
        try {
            const basket = await agent.Basket.upsert(productId, mode);
            return basket.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const toggleStatusItem = createAsyncThunk<number, number>(
    'basket/toggle-status-item',
    async(basketItemId, thunkAPI) => {
        try {
            const status = await agent.Basket.toggleStatusItem(basketItemId);
            return status.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket : (state, action) => {
            state.basket = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getBasket.pending, (state, action) => {
            state.loadingState = true;
        });

        builder.addCase(getBasket.fulfilled, (state, action) => {
            state.loadingState = false;
            state.basket = action.payload;
        });

        builder.addCase(getBasket.rejected, (state, action) => {
            state.loadingState = false;
        });

        ///////////////////////////////////////////////////////////////////////////////

        builder.addCase(upsertBasket.pending, (state, action) => {
            state.loadingState = true;
            console.log('Executing Upsert Basket');
        });

        builder.addCase(upsertBasket.fulfilled, (state, action) => {
            state.loadingState = false;
            state.basket = action.payload;
        });

        builder.addCase(upsertBasket.rejected, (state, action) => {
            state.loadingState = false;
            console.log('Executed Failed !');
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        builder.addCase(toggleStatusItem.pending, (state, action) => {

        });

        builder.addCase(toggleStatusItem.fulfilled, (state, action) => {

            if (!state.basket || !state.basket.items) return;
            const index = state.basket?.items.findIndex(item => item.basketItemId === action.payload);

            if(index !== undefined && index !== -1) {
                state.basket.items[index].status = !state.basket?.items[index].status;
            }
        });

        builder.addCase(toggleStatusItem.rejected, (state, action) => {
            console.log('Executed Failed !');
        });
    }
})

export const {setBasket} = basketSlice.actions

